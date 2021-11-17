import * as fs from 'fs'
import * as path from 'path'
const __dirname = path.resolve()

import { v4 as uuidv4 } from 'uuid';

import { s3Client } from "./s3Client.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// Download file with specified uuid.
export const DownloadFile = async (uuid) => {
    // Set the parameters
    const downloadParams = {
        Bucket: "saadiandco",
        // Add the required 'Key' parameter using the 'path' module.
        Key: uuid,
    }

    try {
        // Create a helper function to convert a ReadableStream to a string.
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
            const chunks = []
            stream.on("data", (chunk) => chunks.push(chunk))
            stream.on("error", reject)
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
        })

        // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
        // TODO - Pipe filestream to res -> data.Body.pipe(res)
        const data = await s3Client.send(new GetObjectCommand(downloadParams))
        // Convert the ReadableStream to a string.
        const bodyContents = await streamToString(data.Body)
        const newFileName = uuid.split("_")[1]
        const fileLocation = __dirname + "/" + newFileName

        return new Promise((resolve) => {
            fs.writeFile(fileLocation, bodyContents, (err) => {
                if(err) throw err
                resolve(fileLocation)
            })
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
        Key: uuid + "_" + file.name,
        // Add the required 'Body' parameter
        Body: file.data,
    }

    try {
        s3Client.send(new PutObjectCommand(uploadParams))
        return (file.name + " has been uploaded / UUID: " + uuid)
    } catch (err) {
        console.log("Error", err)
        return err
    }
}