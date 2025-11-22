import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const exists = await User.findOne({ email })
        if (exists) return res.json({ msg: 'User exists' })
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashed, role })
        res.json(user)
    } catch (err) { res.json(err) }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.json({ msg: 'Invalid credentials' })
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.json({ msg: 'Invalid credentials' })
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
        res.json({ token, role: user.role })
    } catch (err) { res.json(err) }
}