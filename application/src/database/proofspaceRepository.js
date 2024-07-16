import crypto from 'crypto';
import fs from 'fs';
import axios from 'axios';


const keyString = fs.readFileSync('ps_sk', 'utf8');

const url = "https://platform.proofspace.id/service-backend/v1/service/WwDZ3sgsvnYsSvofQ6zjT5/webhook-accept/credentials-issued";
const serviceDid = "WwDZ3sgsvnYsSvofQ6zjT5";

class Proofspace {

    /* 
        Credentials
    */
    gradeCredential = (subject, grade) => {
        return [{
            credentialId: "WwDZ3sgsvnYsSvofQ6zjT5:3:CL:725:tag",
            schemaId: "WwDZ3sgsvnYsSvofQ6zjT5:2:Grade:1.0",
            fields: [
                { name: "Subject", value: subject },
                { name: "Grade", value: grade },
            ],
            utcIssuedAt: new Date().getTime(),
            revoked: false
        }];
    }

    degreeCredential = (school, grade) => {
        return [{
            credentialId: "WwDZ3sgsvnYsSvofQ6zjT5:3:CL:726:tag",
            schemaId: "WwDZ3sgsvnYsSvofQ6zjT5:2:Degree:1.0",
            fields: [
                { name: "School", value: school },
                { name: "Degree", value: grade },
            ],
            utcIssuedAt: new Date().getTime(),
            revoked: false
        }];
    }

    semesterCredential = (semester) => {
        return {
            credentialId: "WwDZ3sgsvnYsSvofQ6zjT5:3:CL:723:tag",
            schemaId: "WwDZ3sgsvnYsSvofQ6zjT5:2:Semester Registration:1.0",
            fields: [
                { name: "Semester", value: semester },
            ],
            utcIssuedAt: new Date().getTime(),
            revoked: false
        };
    }

    courseCredential = (subjects, semester) => {
        const credentials = [];
        for (const subject of subjects) {
            credentials.push({
                credentialId: "WwDZ3sgsvnYsSvofQ6zjT5:3:CL:724:tag",
                schemaId: "WwDZ3sgsvnYsSvofQ6zjT5:2:Course Registration:1.0",
                fields: [
                    { name: "Subject", value: subject },
                    { name: "Semester", value: semester },
                ],
                utcIssuedAt: new Date().getTime(),
                revoked: false
            });
        }
        return credentials;
    }

    uniCredential = (school, studendId) => {
        return [{
            credentialId: "WwDZ3sgsvnYsSvofQ6zjT5:3:CL:721:tag",
            schemaId: "WwDZ3sgsvnYsSvofQ6zjT5:2:University Registration:1.1",
            fields: [
                { name: "School", value: school },
                { name: "StudentID", value: studendId },
            ],
            utcIssuedAt: new Date().getTime(),
            revoked: false
        }];
    }

    submit = async (userDid, credentials) => {
        if (!userDid)
            return;
        const request = {
            serviceDid,
            subscriberConnectDid: userDid,
            subscriberEventId: "",
            credentials,
            issuedAt: new Date().getTime(),
        };

        const binaryBody = Buffer.from(JSON.stringify(request), "utf-8");
        const headers = {
            'Content-Type': 'application/json'
        };

        const key = crypto.createPrivateKey({ key: keyString });
        const signature = crypto.sign('sha3-256', binaryBody, key);

        headers['X-Body-Signature'] = signature.toString('base64');
        axios.post(
            url,
            binaryBody,
            {
                headers: headers
            }
        ).then((reply) => {
            return reply.data;
        }).catch((err) => {
            throw err;
        });
    }

    issueRegistrationCredentials = async (userDid, subjects, semester) => {
        const creds = [
            ...this.courseCredential(subjects, semester),
            this.semesterCredential(semester)
        ];
        await this.submit(userDid, creds);
    }

    issueGradesCredentials = async (grades, subject) => {
        for (const grade of grades) {
            await this.submit(grade.did, this.gradeCredential(subject, grade.grade));
        }
    }

    issueDegreeCredential = async (userDid, school, degree) => {
        await this.submit(userDid, this.degreeCredential(school, degree));
    }

    issueUniCredential = async (userDid, studentId, school) => {
        await this.submit(userDid, this.uniCredential(school, studentId));
    }
}

export default Proofspace;