function intermediateconditional136() {
    try {
        var retornaParaLooping = false;
        var enviaParaProximaAtividade = true;
        var documentId = hAPI.getCardValue("idDocContrato");

        if (documentId != "" && documentId != 0) {
            var statusAssinaturaContrato = verificaSeContratoAprovado(documentId);
            hAPI.setTaskComments(getValue('WKUser'), getValue('WKNumProces'), "0", "Assinatura com Status (" + statusAssinaturaContrato + ")");
            if (statusAssinaturaContrato == "Pendente Assinatura") {
                return retornaParaLooping;
            }
            else if(statusAssinaturaContrato == "Assinado"){
                hAPI.setCardValue("statusAssinaturaEletronica", statusAssinaturaContrato);

                var coligada = hAPI.getCardValue("hiddenCodColigada");
                var IDCNT = hAPI.getCardValue("idCntRm");
                if (!IDCNT || IDCNT == null || IDCNT == "") {
                    return enviaParaProximaAtividade;
                }
                var tpcont = hAPI.getCardValue("tpCont");
                var tipoRescisao = 3;
                if (tpcont == tipoRescisao) {
                    var CODSTACNT_RESCISAO = "03";
                    AtualizaStatusContrato(coligada, IDCNT, CODSTACNT_RESCISAO);
                }else{
                    var CODSTACNT_ATIVO = "01";
                    AtualizaStatusContrato(coligada, IDCNT, CODSTACNT_ATIVO);
                }
                
                return enviaParaProximaAtividade;
            }else{
                hAPI.setCardValue("statusAssinaturaEletronica", statusAssinaturaContrato);
                return enviaParaProximaAtividade;
            }
        }
    } catch (error) {
        log.info("Erro ao verificar assinatura eletronica nos Contratos intermediateconditional136: " + (error && error.message ? error.message : String(error)));
        hAPI.setTaskComments(getValue('WKUser'), getValue('WKNumProces'), "0", "Erro ao verificar assinatura eletronica nos Contratos intermediateconditional136: " + (error && error.message ? error.message : String(error)));
        if (error && error.stack) {
            log.info("Stack: " + String(error.stack));
        }
        hAPI.setCardValue("statusAssinaturaEletronica", "ERRO");
        return retornaParaLooping;
    }
}

function verificaSeContratoAprovado(documentId){
    var ds = DatasetFactory.getDataset("ds_form_aux_wesign", null,[
        DatasetFactory.createConstraint("codArquivo", documentId, documentId, ConstraintType.MUST)
    ],null);
        
    return ds.getValue(0,"statusAssinatura");
}

function AtualizaStatusContrato(CODCOLIGADA, IDCNT, CODSTACNT) {
    try {
        if (!CODCOLIGADA || CODCOLIGADA == null || CODCOLIGADA == "") {
            throw "Necessário informar CODCOLIGA";
        }
        if (!IDCNT || IDCNT == null || IDCNT == "") {
            throw "Necessário informar IDCNT";
        }
        if (!CODSTACNT || CODSTACNT == null || CODSTACNT == "") {
            throw "Necessário informar CODSTACNT";
        }

        var xml =
            "<CtrCnt>\
            <TCnt>\
                <CODCOLIGADA>" + CODCOLIGADA + "</CODCOLIGADA>\
                <IDCNT>" + IDCNT + "</IDCNT>\
                <CODSTACNT>" + CODSTACNT + "</CODSTACNT>\
            </TCnt>\
        </CtrCnt>";
        var contexto = "CODSISTEMA=G;CODCOLIGADA=" + CODCOLIGADA + ";CODUSUARIO=fluig";

        var retorno = DatasetFactory.getDataset("InsereContratoRM", null, [
            DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST),
            DatasetFactory.createConstraint("contexto", contexto, contexto, ConstraintType.MUST),
            DatasetFactory.createConstraint("idContrato", IDCNT, IDCNT, ConstraintType.MUST),
            DatasetFactory.createConstraint("coligada", CODCOLIGADA, CODCOLIGADA, ConstraintType.MUST),
        ], null);
        if (!retorno || retorno == "" || retorno == null) {
            throw "Houve um erro na comunicação com o webservice. Tente novamente!";
        } else {
            if (retorno.values[0][0] == "false") {
                throw "Erro ao gerar contrato. Favor entrar em contato com o administrador do sistema. Mensagem: " + retorno.values[0][1];
            } else if (retorno.values[0][0] == "true") {
                hAPI.setCardValue("idCntRm", retorno.values[0][2]);
            }
        }
    } catch (error) {
        throw error;
    }
}