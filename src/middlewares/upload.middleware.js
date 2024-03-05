const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'eams-test-7f4a7',
    keyFilename: 'eams-test-7f4a7-firebase-adminsdk-hfara-9c9ec246a0.json'
});

const bucket = storage.bucket('gs://eams-test-7f4a7.appspot.com');

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter
});

const uploadToFirebase = (file, folder, ibFormId, identity) => {
    return new Promise((resolve, reject) => {
        // const filename = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        const filename = `${Date.now()}-${uuidv4()}${identity}${ibFormId}`;
        // const fileUpload = bucket.file(filename);
        var fileUpload = bucket.file(`${folder}/${filename}`);

        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: { firebaseStorageDownloadTokens: uuidv4() }
            }
        });
        // stream.on('error', reject);
        // stream.on('finish', () => {
        //     fileUpload.makePublic().then(() => {
        //         resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${folder}%2F${filename}?alt=media&token=${uuid()}`);
        //         // resolve(`https://storage.googleapis.com/${bucket.name}/${filename}`);
        //     }).catch(reject);
        // });

        stream.on('error', (error) => {
            console.log(error);
            reject('Something is wrong! Unable to upload at the moment.', error);
        });

        stream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            // const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            const newpath = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${folder}%2F${filename}?alt=media&token=${uuidv4()}`);

            // console.log(newpath);
            resolve(newpath);
        });

        stream.end(file.buffer);
    });
};

module.exports = upload;
module.exports.uploadToFirebase = uploadToFirebase;
