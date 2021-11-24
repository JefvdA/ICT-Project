import { v4 as uuidv4 } from 'uuid';

import { s3Client } from "./s3Client.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import { Upload } from '../rds.js'

// Download file with specified uuid.
export const DownloadFile = async (uuid) => {
    // Set the parameters
    const downloadParams = {
        Bucket: "saadiandco",
        // Add the required 'Key' parameter using the 'path' module.
        Key: uuid,
    }

    try {
        // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
        const data = await s3Client.send(new GetObjectCommand(downloadParams))

        return new Promise((resolve) => {
            resolve(data.Body) // Return the ReadableStream as a resolve
        })

    } catch (err) {
        console.log("Error", err)
    }
}

export const UploadFile = (file) => {
    const uuid = uuidv4()

    // Set the parameters
    const uploadParams = {
        Bucket: "saadiandco",
        // Add the required 'Key' parameter using the 'path' module.
        Key: uuid,
        // Add the required 'Body' parameter
        Body: file.data,
    }

    try {
        s3Client.send(new PutObjectCommand(uploadParams))

        Upload(file.name, uuid);

        return (file.name + " has been uploaded / UUID: " + uuid)
    } catch (err) {
        console.log("Error", err)
        return err
    }
}