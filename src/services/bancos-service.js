class BancosService {
    async getAll() {
        return [{ msg: "¡Bancos!" }];
    }
}

module.exports = new BancosService();
