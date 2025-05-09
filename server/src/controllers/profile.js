const profile = async (req,res) => {
    loggedInUser = req.user
    try {
        res.json({ message: "User fetch sucessfully", data: loggedInUser });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
}

module.exports = { profile }