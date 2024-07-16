import path from "path";
import filesystem from "fs";

const walk = (dir) => {
    const walk = async (dir, extention = ".js", filelist = []) => {
        const files = await filesystem.readdirSync(dir);

        let file;

        for (file of files) {
            const filepath = path.join(dir, file);
            const stat = await filesystem.statSync(filepath);

            if (stat.isDirectory()) {
                filelist = await walk(filepath, extention, filelist);
            } else if (file.endsWith(extention)) {
                filelist.push({ name: file, path: filepath });
            }
        }
        return filelist;
    };
    return walk(dir);
};

export default walk;
