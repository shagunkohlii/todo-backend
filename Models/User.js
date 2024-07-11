const { randomBytes, createHmac } = require("crypto");
const { Schema, model, mongoose } = require("mongoose")
const { createTokenForUser } = require("../services/authentication")


const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    userTaskData: [{ type: Schema.Types.ObjectId, ref: 'task' }]
}, { timestamps: true });


userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next()
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    console.log(user);

    if (!user) throw new Error("user not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    console.log("hashedpassword", hashedPassword)

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    console.log("userProvidedHash", userProvidedHash)

    if (hashedPassword !== userProvidedHash)
        throw new Error("incorrect password");

    const token = createTokenForUser(user);
    return token;
});


const USER = model("user", userSchema);
module.exports = USER