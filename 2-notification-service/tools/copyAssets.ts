import fs from 'fs-extra';

const copyFiles = async () => {
  try {
    await fs.copy('src/emails', 'build/src/emails');
    console.log('Files copied successfully!');
  } catch (err) {
    console.error(err);
  }
};

copyFiles();
