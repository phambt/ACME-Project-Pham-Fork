import * as fs from 'fs';
import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import * as path from 'path';

export async function getLicense(url: string, repository: string): Promise<number> {
    const cloneDir = path.join('./clonedGitRepos', repository);
    // console.log('***LICENSE URL: ' + url);

    try {
        //create the clonedGitRepos folder if there isn't one
        if (!fs.existsSync('./clonedGitRepos')) {
            fs.mkdirSync('./clonedGitRepos', { recursive: true });
        }

        //clone the repos using depth=1 (so we only get the most recent commit)
        await git.clone({
            fs,
            http,
            dir: cloneDir,
            url: url,
            singleBranch: true,
            depth: 1
        });

        //search for LICENSE file
        const files = fs.readdirSync(cloneDir);
        const foundLicense = files.find(file => /LICENSE(\..*)?$/i.test(file));

        //remove cloned repo
        fs.rmSync(cloneDir, { recursive: true, force: true });

        //return if we found the LICENSE file
        return foundLicense ? 1 : 0;

    } catch (err) { //error case
        console.error('Error in cloning or searching for license:', err);
        return 0;
    }
}
