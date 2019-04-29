const Main = async () => {
    const NovaEpoca = require('../novaepoca/NovaEpoca');
    const params = {
        url: url,
        purpose: "prontos",
        locations: "Meier"
    };
    const url = `https://www.novaepoca.com.br/prontos/?
                    finalidade=${purpose}&
                    localizacao=${location}&
                    ValorMin=0&
                    ValorMax=5.000.000+&
                    AreaMin=0&
                    AreaMax=6.000+`;
    const ne = new NovaEpoca(params);
    await ne.extract();
}

(async () => await Main() )();