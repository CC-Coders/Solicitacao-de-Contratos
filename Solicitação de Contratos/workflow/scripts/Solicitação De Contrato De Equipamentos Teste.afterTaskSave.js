function afterTaskSave(colleagueId,nextSequenceId,userList){
    var atividade = getValue("WKNumState");
    var contOk = hAPI.getCardValue("decisaoCont");

    if (atividade == 23) {
        if (contOk == 1) {
            if (hAPI.getCardValue("radioOptAssinatura") == "Eletronica") {
                return ExecutaIntegracaoAssinaturaEletronicaWeSign();
            }
        }
    }

    if (atividade == 118) {
        log.info("afterTaskSave ==> " + atividade)
        if (contOk == 1 && (hAPI.getCardValue("atividadeParalela")== true || hAPI.getCardValue("atividadeParalela")== "true")) {
            if (hAPI.getCardValue("radioOptAssinatura") == "Eletronica") {
                log.info("Diretoria ==> " + atividade)
                return ExecutaIntegracaoAssinaturaEletronicaWeSign();
            }
        }
    }
}

function ExecutaIntegracaoAssinaturaEletronicaWeSign(){

    var ds_upload = DatasetFactory.getDataset("ds_upload_wesign_manual", null, [
        DatasetFactory.createConstraint('codArquivo', hAPI.getCardValue("idDocContrato"), hAPI.getCardValue("idDocContrato"), ConstraintType.MUST)
    ], null);
    log.info("ds_upload ==> " + ds_upload)
    log.dir(ds_upload)
    return true;
}