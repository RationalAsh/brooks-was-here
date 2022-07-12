import fs from "fs";
import Arweave from "arweave";

// Function to upload file to arweave.
export async function uploadFileToArweave() {
    const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
        timeout: 20000,
        logging: false
    })
    return 0;
}