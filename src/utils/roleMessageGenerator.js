const roleMessageGenerator = (...roles, logedInEmployeeRole) => {
    let message

    if (!roles.includes(logedInEmployeeRole)) {
        message = 'Vaša radna "uloga" nema ovlaštenja da izvršava ovaj vid akcije!'
    }

    return message
}

export default roleMessageGenerator