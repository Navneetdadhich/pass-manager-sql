const crypto = require("crypto");
const secret = "pppppppppppppppppppppppppppppppp";

const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv("aes-256-ctr",Buffer.from(secret),iv);

    const encryptedPassword = Buffer.concat([
        cipher.update(password),
        cipher.final(),
    ]);

    return {iv: iv.toString("hex"), password: encryptedPassword.toString("hex")};
};

const decrypt = (encryption) => {

    const buffer = Buffer.from(encryption, 'base64');

    const decipher = crypto.createDecipheriv(
        "aes-256-ctr",
        Buffer.from(secret),
        Buffer.from(encryption.iv, "hex")
    );

    const decryptPassword = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, "hex")),
        decipher.final(),
    ]);
    return decryptPassword.toString();
};

module.exports = {encrypt, decrypt};