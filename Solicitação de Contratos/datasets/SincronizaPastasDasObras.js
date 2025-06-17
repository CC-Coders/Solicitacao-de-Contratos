function defineStructure(){
    addColumn("CODCOLIGADA");
    addColumn("CODCCUSTO");
    addColumn("NOME");
    addColumn("DOCUMENTID");
    setKey([ "CODCCUSTO"]);
    addIndex([ "CODCCUSTO" ]);
}

function onSync(lastSyncDate){
    return sincronizaPastas();  
}
function createDataset(fields, constraints, sortFields) {
    return sincronizaPastas();
}

function sincronizaPastas() {
    try {
        var pastas = consultasPastasDasObras();

        var listaFiltrada = [];
        for (var i = 0; i < pastas.length; i++) {
            var pasta = pastas[i];

            var nomePasta = pasta.DS_PRINCIPAL_DOCUMENTO;
            var CCustoNoNomeDaPasta = nomePasta.split(" - ")[0];
            if (CCustoNoNomeDaPasta != null && CCustoNoNomeDaPasta.length == 7 && CCustoNoNomeDaPasta[1] == "." && CCustoNoNomeDaPasta[3] == ".") {
                listaFiltrada.push(pasta);
            }
            
        }

        var dataset = DatasetBuilder.newDataset();
        dataset.addColumn("CODCOLIGADA");
        dataset.addColumn("CODCCUSTO");
        dataset.addColumn("NOME");
        dataset.addColumn("DOCUMENTID");

        for (var i = 0; i < listaFiltrada.length; i++) {
            var linha = listaFiltrada[i];
            dataset.addOrUpdateRow([linha.CODCOLIGADA, linha.DS_PRINCIPAL_DOCUMENTO.split(" - ")[0], linha.DS_PRINCIPAL_DOCUMENTO, linha.NR_DOCUMENTO]);
        }

        return dataset;


    } catch (error) {
        if (typeof error == "object") {
            var mensagem = "";
            var keys = Object.keys(error);
            for (var i = 0; i < keys.length; i++) {
                mensagem += (keys[i] + ": " + error[keys[i]]) + " - ";
            }
            log.info("Erro ao executar Dataset:");
            log.dir(error);
            log.info(mensagem);

            return returnDataset("ERRO", mensagem, null);
        } else {
            return returnDataset("ERRO", error, null);
        }
    }
}


function consultasPastasDasObras(){
    var query = "";
    query += "SELECT ";
    query += "	CASE ";
    query += "		WHEN DOCUMENTO.NR_DOCUMENTO_PAI = 49 THEN 1 ";
    query += "		WHEN DOCUMENTO.NR_DOCUMENTO_PAI = 1682944 THEN 2 ";
    query += "		WHEN DOCUMENTO.NR_DOCUMENTO_PAI = 1245095 THEN 12 ";
    query += "	END AS CODCOLIGADA, ";
    query += "	N2.DS_PRINCIPAL_DOCUMENTO, ";
    query += "	N2.NR_DOCUMENTO ";
    query += "FROM DOCUMENTO  ";
    query += "INNER JOIN DOCUMENTO N2 ON N2.NR_DOCUMENTO_PAI = DOCUMENTO.NR_DOCUMENTO ";
    query += "WHERE  ";
    query += "	DOCUMENTO.TP_DOCUMENTO = 1  ";
    query += "	AND DOCUMENTO.NR_DOCUMENTO != 17119 ";
    query += "	AND N2.VERSAO_ATIVA = 1 ";
    query += "	AND DOCUMENTO.NR_DOCUMENTO_PAI IN (49, 1245095) ";
    query += "UNION ";
    query += "SELECT  ";
    query += "	CASE ";
    query += "		WHEN N2.NR_DOCUMENTO_PAI = 1682944 THEN 2 ";
    query += "	END AS CODCOLIGADA, ";
    query += "	N2.DS_PRINCIPAL_DOCUMENTO, ";
    query += "	N2.NR_DOCUMENTO ";
    query += "FROM DOCUMENTO N2 ";
    query += "WHERE  ";
    query += "	N2.TP_DOCUMENTO = 1  ";
    query += "	AND N2.NR_DOCUMENTO_PAI = 1682944 ";
    query += "	AND N2.VERSAO_ATIVA = 1 ";
    query += "ORDER BY CODCOLIGADA ";

    return executaQuery(query);
}

function executaQuery(query) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/AppDS";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(query);
        var columnCount = rs.getMetaData().getColumnCount();

        var retorno = [];

        while (rs.next()) {
            var linha = {};
            for (var i = 1; i <= columnCount; i++) {
                linha[rs.getMetaData().getColumnName(i)] = rs.getObject(rs.getMetaData().getColumnName(i)).toString() + "";
            }

            retorno.push(linha);
        }
        return retorno;
    } catch (e) {
        log.error("ERRO==============> " + e.message);
        newDataset.addColumn("coluna");
        newDataset.addRow(["deu erro! "]);
        newDataset.addRow([e.message]);
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}



// Utils
function getConstraints(constraints) {
    var retorno = {};
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            var constraint = constraints[i];
            retorno[constraint.fieldName] = constraint.initialValue;
        }
    }
    return retorno;
}
function returnDataset(STATUS, MENSAGEM, RESULT) {
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("STATUS");
    dataset.addColumn("MENSAGEM");
    dataset.addColumn("RESULT");
    dataset.addRow([STATUS, MENSAGEM, RESULT]);
    return dataset;
}
function lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, listConstrainstObrigatorias) {
    try {
        var retornoErro = [];
        for (var i = 0; i < listConstrainstObrigatorias.length; i++) {
            if (constraints[listConstrainstObrigatorias[i]] == null || constraints[listConstrainstObrigatorias[i]] == "" || constraints[listConstrainstObrigatorias[i]] == undefined) {
                retornoErro.push(listConstrainstObrigatorias[i]);
            }
        }

        if (retornoErro.length > 0) {
            throw "Constraints obrigatorias nao informadas (" + retornoErro.join(", ") + ")";
        }
    } catch (error) {
        throw error;
    }
}


// var ds = DatasetFactory.getDataset("SincronizaPastasDasObras", null,null,null)