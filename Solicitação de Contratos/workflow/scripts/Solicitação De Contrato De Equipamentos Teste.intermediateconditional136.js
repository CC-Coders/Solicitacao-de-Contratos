function intermediateconditional136() {
    try {
        var retornaParaLooping = false;
        var enviaParaProximaAtividade = true;
        var documentId = hAPI.getCardValue("idDocContrato");

        if (documentId != "" && documentId != 0) {
            var statusAssinaturaContrato = verificaSeContratoAprovado(documentId);
            if (statusAssinaturaContrato == "Pendente Assinatura") {
                return retornaParaLooping;
            }
            else if(statusAssinaturaContrato == "Assinado"){
                hAPI.setCardValue("statusAssinaturaEletronica", statusAssinaturaContrato);

                var coligada = hAPI.getCardValue("codColigada");
                var IDCNT = hAPI.getCardValue("idCntRm");
                var CODSTACNT_ATIVO = "01";
                AtualizaStatusContrato(coligada, IDCNT, CODSTACNT_ATIVO);

                return enviaParaProximaAtividade;
            }else{
                hAPI.setCardValue("statusAssinaturaEletronica", statusAssinaturaContrato);
                return enviaParaProximaAtividade;
            }
        }
    } catch (error) {
        log.info("Erro ao verificar assinatura eletronica nos Contratos intermediateconditional136:");
        log.dir(error);
        hAPI.setCardValue("statusAssinaturaEletronica", "ERRO");
        return enviaParaProximaAtividade;
    }
}

function verificaSeContratoAprovado(documentId){
    var ds = DatasetFactory.getDataset("ds_form_aux_wesign", null,[
        DatasetFactory.createConstraint("codArquivo", documentId, documentId, ConstraintType.MUST)
    ],null);
        
    return ds.getValue(0,"statusAssinatura");
}