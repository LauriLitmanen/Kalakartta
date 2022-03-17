const aws = require('aws-sdk');
const crypto = require('crypto');
const { promisify } = require('util');

const region = "eu-north-1";
const bucketName = "kalakarttabucket";
const accessKeyId =  process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})


// Create a presigned url to upload image to the S3 bucket
// More info on presigned urls: https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
 const generateUploadURL = async function () {
     // make a random string for the name of the image i.e. "91aea217eb99aca9d19683d02de84fb5"
    const randomBytes = promisify(crypto.randomBytes);
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60 
    });

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
};

exports.generateUploadURL = generateUploadURL;