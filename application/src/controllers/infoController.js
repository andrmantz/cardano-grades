import SubjectRepository from "../database/subjectRepository.js";
import TeacherDoesSubjectRepository from "../database/teacherDoesSubjectRepository.js";
import { toText, fromUnit } from "lucid-cardano";

const subjectRepository = new SubjectRepository();
const teacherDoesSubjectRepository = new TeacherDoesSubjectRepository();


class InfoController {
    getPolicies = async (req, res) => {
        try {
            const cardanoRepository = req.app.get("cardanoRepository");

            const policies = await cardanoRepository.getPolicies();

            const allSubjects = await subjectRepository.findAll();

            const subjectNames = policies.subjects.map(subject => toText(subject.name));


            const subjects = allSubjects.filter(subject => subjectNames.includes(subject.name))
                .map(subject => ({ id: subject.id, name: subject.name }));

            res.json(subjects);
        } catch (error) {
            res.status(400).send("Error");

        }

    };

    getSubject = async (req, res) => {
        try {
            const id = req.params.id;

            const cardanoRepository = req.app.get("cardanoRepository");

            const subject = await subjectRepository.findOne(id);
            const gToken = {
                sName: subject.name,
                gToken: JSON.parse(atob(subject.token)),
            };

            const subjectDetails = await cardanoRepository.getSubjectDetails(gToken);
            const teachers = await teacherDoesSubjectRepository.teacherForSubject(id);

            if (!teachers || teachers.length !== 1) {
                return res.status(404).send("Teacher not found");
            }

            const teacher = teachers[0];

            res.json({
                id: subject.id,
                name: subject.name,
                semester: subject.semester,
                token: cardanoRepository.gUnit(gToken),
                contract: cardanoRepository.sAddress(gToken),
                registeredStudents: subjectDetails.registrations.map(student => toText(student)),
                teacher: {
                    id: teacher.teachers.id,
                    name: `${teacher.teachers.lastName} ${teacher.teachers.firstName}`,
                    email: teacher.teachers.email,
                    address: teacher.teachers.address,
                }
            });

        } catch (error) {
            res.status(400).send("Error");
        }
    };

    utxosAt = async (req, res) => {
        try {
            const address = req.params.address;
            const cardanoRepository = req.app.get("cardanoRepository");

            const utxos = await cardanoRepository.utxosat(address);

            const result = utxos.map(tx => {
                const assets = Object.keys(tx.assets).reduce((acc, key) => {

                    let assetName;
                    const assetName_ = fromUnit(key).assetName;

                    if (!assetName_) {
                        assetName = key;
                    } else {
                        if (cardanoRepository.getRPolicy() == fromUnit(key).policyId) {
                            assetName = `Registration Token ${toText(assetName_)}`;
                        } else if (cardanoRepository.getDPolicy() == fromUnit(key).policyId) {
                            assetName = `Degree Token ${toText(assetName_)}`;

                        } else {
                            assetName = toText(assetName_);
                        }
                    }
                    acc[assetName] = String(tx.assets[key]);
                    return acc;
                }, {});

                return {
                    txHash: tx.txHash,
                    assets
                };
            });

            res.json(result);

        } catch (error) {
            res.status(400).send("Error");
        }
    };

    studentAddress = async (req, res) => {
        try {
            const id = req.params.id;
            const cardanoRepository = req.app.get("cardanoRepository");

            res.json(cardanoRepository.studentAddress(id));
        } catch (error) {
            res.status(404).send("Student not found");

        }
    };

}

export default InfoController;