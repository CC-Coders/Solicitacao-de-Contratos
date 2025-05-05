function CarregaListaEquipamentos() {
    $(".checkboxEqp").on("click", function () {
        if ($("#isContratoSave").val() == 1) {
            FLUIGC.toast({
                title: "Erro: ",
                message: "Não é possivel incluir ou remover equipamentos com o contrato salvo.",
                type: "warning"
            });
            return false;
        } else {
            var tr = $(this).closest("tr");
            var row = dataTable.row(tr[0]);
            var values = row.data();

            if ($(this).is(":checked")) {
                var valida = true;

                var cnpj = values.CPFCNPJ;
                $(".checkboxEqp:checked").each(function () {
                    if (dataTable.row($(this).closest("tr")).data().CPFCNPJ != cnpj) {
                        valida = false;
                    }
                });

                var modeloContrato = $("#modeloContrato").val();

                if (valida) {
                    BuscaFornecedor(values.CPFCNPJ);
                    row.child(showDetails(values)).show();
                    tr.addClass("shown");
                    $(tr).find("td:first").attr("rowspan", 2);
                    $("#tableEquipamentos").find(".form-control").on("blur", function () {
                        ValidaTerminoTabEquipamentos("Valida");
                    });
                    $("#tableEquipamentos").find(".form-control").on("focus touch", function () {
                        $(this).removeClass("has-error");
                    });
                    $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).mask("000.000.000.000,00", { reverse: true });
                    $("#Valor_" + values.PREFIXO.replace(".", "")).mask("000.000.000.000,00", { reverse: true });
                    $("#tableEquipamentos").find(".form-control").off("blur");

                    let equipamentos = $("#objetoEquipamentos").val();
                    equipamentos = equipamentos == "" || equipamentos == null ? [] : JSON.parse(equipamentos);
                    equipamentos.push(values);
                    $("#objetoEquipamentos").val(JSON.stringify(equipamentos));

                    if ($("#idContrato").val() == 1 || $("#idContrato").val() == 4 || $("#idContrato").val() == 19) {
                        

                        if ($("#selecionadoContratoAditivos").val()){
                             var html =
                            "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
                            <td class='tableTd'>" + values.PREFIXO + "</td>\
                            <td class='tableTd'>" + values.DESCRICAO + "</td>\
                            <td class='tableTd'>" + values.FABRICANTE + "</td>\
                            <td class='tableTd'>" + values.MODELO + "/" + values.ANO + "</td>\
                            <td class='tableTd'>";
                            
                            if ((values.PLACA ?? "") != "") {
                                html += values.PLACA;
                            } else {
                                html += "";
                            }
                            
                            html += "</td>\
                            <td class='tableTd'>";
                            
                            if ((values.CHASSI ?? "") != "") {
                                html += values.CHASSI;
                            } else {
                                html += "";
                            }
                            
                            html += "</td>\
                                <td class='tableTd'>" + (values.POTENCIA ?? "") + "</td>\
                                <td class='tableTd'>" + (values.CAPACIDADE ?? "") + "</td>\
                                <td class='tableTd'>" + (values.UNIDADE ?? "") + "</td>";
                            html += "<td class='tableTd'>";
                            
                            var valor = FormataValor(values.VALORLOCACAO)
                            
                            valor = valor.substring(3, valor.length)
                            html += valor + "</td>\
                            </tr>";
                            console.log(values.VALORLOCACAO);
                            
                            $("#tbodyAditivo").append(html);
                        } else {
                            if(modeloContrato == "Locação de Equipamento" && $("#selectOptLocEquipamento").val() == 'Sem Mão de Obra'){
                                var html =
                                "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
                                <td class='tableTd'>" + values.PREFIXO + "</td>\
                                <td class='tableTd'>" + values.DESCRICAO + "</td>\
                                <td class='tableTd'>" + values.MODELO + "</td>\
                                <td class='tableTd'>" + values.ANO + "</td>\
                                <td class='tableTd'>" + values.PLACA + "</td>\
                                <td class='tableTd'>" + values.CHASSI + "</td>\
                                <td class='tableTd valorContrato'>";
                                

                                var valor = FormataValor(values.VALORLOCACAO)
                                valor = valor.substring(3, valor.length)

                                html += valor + "</td>\
                                </tr>";
                               
                                $("#tbody").append(html);
                                var totalContrato = 0;
                                $(".valorContrato").each(function(e , i) {
                                    var valorItem = $(i).text();
                                    valorItem = valorItem.replaceAll(".", "");
                                    valorItem = valorItem.replaceAll(",", ".");

                                    totalContrato = totalContrato +  parseFloat(valorItem);
                                });
                                
                                var valorTotal = FormataValor(totalContrato)
                                valorTotal = valorTotal.substring(3, valorTotal.length)
                                $("#valorContrato").val(valorTotal);
                            }else{
                                var html =
                                "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
                                <td class='tableTd'>" + values.PREFIXO + "</td>\
                                <td class='tableTd'>" + values.DESCRICAO + "</td>\
                                <td class='tableTd'>" + values.FABRICANTE + "</td>\
                                <td class='tableTd'>" + values.MODELO + "</td>\
                                <td class='tableTd'>" + values.ANO + "</td>\
                                <td class='tableTd'>";
                                if (values.PLACA != "") {
                                    html += values.PLACA;
                                } else {
                                    html += values.CHASSI;
                                }
                                html += "</td>\
                                    <td class='tableTd'>" + (values.POTENCIA ?? "") + "</td>\
                                    <td class='tableTd'>" + (values.CAPACIDADE ?? "") + "</td>\
                                    <td class='tableTd'>" + (values.UNIDADE ?? "") + "</td>\
                                    <td class='tableTd'>";

                                var valor = FormataValor(values.VALORLOCACAO)
                                valor = valor.substring(3, valor.length)

                                html += valor + "</td>\
                                </tr>";
                                console.log(values.VALORLOCACAO);
                                $("#tbody").append(html);
                                }
                            
                        }

                        $("#Descricao_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(2)").text($(this).val());
                        });
                        $("#Fabricante_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(3)").text($(this).val());
                        });
                        $("#Modelo_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(4)").text($(this).val());
                        });
                        $("#Ano_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(5)").text($(this).val());
                        });
                        $("#Placa_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(6)").text($(this).val());
                        });
                        $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(7)").text($(this).val());
                        });
                    }
                    else if ($("#idContrato").val() == 11 || $("#idContrato").val() == 12) {
                        var html =
                            "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
                            <td class='tableTd'>" + values.PREFIXO + "</td>\
                            <td class='tableTd'>" + values.DESCRICAO + "</td>\
                            <td class='tableTd'>" + values.FABRICANTE + "</td>\
                            <td class='tableTd'>";
                        if (values.PLACA != "") {
                            html += values.PLACA;
                        } else {
                            html += values.CHASSIS;
                        }
                        html += "</td>\
                            <td class='tableTd'>" + values.ANO + "</td>\
                        </tr>";

                        $("#tbody").append(html);

                        $("#Descricao_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(2)").text($(this).val());
                        });
                        $("#Fabricante_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(3)").text($(this).val());
                        });
                        $("#Placa_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(4)").text($(this).val());
                        });
                        $("#Ano_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(5)").text($(this).val());
                        });
                    }
                } else {
                    FLUIGC.toast({
                        title: "Erro: ",
                        message: "Não é possível escolher equipamentos de fornecedores diferentes.",
                        type: "warning"
                    });
                    return false;
                }
            } else {
                if (!($("#selecionadoContratoAditivos").val())){
                    $("#tabelaEquipamentos").find("tbody").find(".linhaEquipamento" + values.PREFIXO.replace(".", "")).remove();
                }
                $("#tabelaEquipamentosAditivo").find("tbody").find(".linhaEquipamento" + values.PREFIXO.replace(".", "")).remove();

                let equipamentos = JSON.parse($("#objetoEquipamentos").val());
                equipamentos = equipamentos.filter(a => a.PREFIXO != values.PREFIXO);
                $("#objetoEquipamentos").val(JSON.stringify(equipamentos));

                row.child.hide();
                $(tr).find("td:first").attr("rowspan", 1);
                tr.removeClass("shown");
            }
            ValidaTerminoTabEquipamentos("Valida");
        }
    });

    $("#tbodyEquipamentos").on("change", "input", function() {
        var tr = $(this).closest("tr");
        capturarAlteracaoEquipamento(tr);
    });

    $("#tbodyAditivo").on("change", "input", function() {
        var tr = $(this).closest("tr");
        capturarAlteracaoEquipamento(tr);
    });

    var obra = $("#hiddenCODGCCUSTO").val();
    var contrato = $("#CodigoContrato").val().split(" - ")[0];

    if ($("#selecionadoContratoAditivos").val()){
        preencherEquipamentos(obra, contrato);
    }
}

function capturarAlteracaoEquipamento(tr) {
    var prefixo = tr.find("input").first().attr("id").split("_")[1];

    var equipmentData = {
        MODELO: $("#Modelo_" + prefixo).val(),
        DESCRICAO: $("#Descricao_" + prefixo).val(),
        VALOR: $("#Valor_" + prefixo).val(),
        VALORLOCACAO: $("#ValorLocacao_" + prefixo).val(),
        PLACA: $("#Placa_" + prefixo).val(),
        CHASSI: $("#Chassi_" + prefixo).val(),
        FABRICANTE: $("#Fabricante_" + prefixo).val(),
        ANO: $("#Ano_" + prefixo).val()
    };

    let equipamentos = $("#objetoEquipamentos").val();
    equipamentos = equipamentos === "" || equipamentos === null ? [] : JSON.parse(equipamentos);


    let index = equipamentos.findIndex(eqp => eqp.PREFIXO.replace(".","") === prefixo);
    if (index !== -1) {
        equipmentData.PREFIXO = equipamentos[index].PREFIXO;
        equipamentos[index] = equipmentData;
    }
    $("#objetoEquipamentos").val(JSON.stringify(equipamentos));
}

function geraListEquipamentos() {
    var obra = $("#hiddenCODGCCUSTO").val();
    var c1 = DatasetFactory.createConstraint("OPERACAO", "SELECTWHEREOBRA", "SELECTWHEREOBRA", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODCCUSTO", obra, obra, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2], null);

    dataTable.clear().draw();
    $("#btnAdicionarEquipamento").hide();
    $("#btnAdicionarEquipamento_1").hide();
    dataTable.rows.add(ds.values); // Add new data
    dataTable.columns.adjust().draw(); // Redraw the DataTable
    $("#tableEquipamentos").css("width", "100%");
    CarregaListaEquipamentos();
}

function GeraListaEquipamentosSelecionados() {
    var equipamentosSel = $("#objetoEquipamentos").val();
    var equipamentosContrato = $("#equipamentosContrato").val();
    if (typeof equipamentosSel != "object" && equipamentosSel != "") {
        equipamentosSel = JSON.parse(equipamentosSel);
    }
    if (typeof equipamentosContrato != "object" && equipamentosContrato != "") {
        equipamentosContrato = JSON.parse(equipamentosContrato);
    }

    var countEquipamentosContrato = countEquipamentosSel = 0;

    for (var i = 0; i < equipamentosSel.length; i++) {
        var eqpSel = equipamentosSel[countEquipamentosSel];
        if (typeof eqpSel != "object") {
            eqpSel = JSON.parse(eqpSel);
        }

        addItemListaEquipamentos(eqpSel, true);
        countEquipamentosSel++;
    }

    for (var i = 0; i < equipamentosContrato.length; i++) {
        var eqpSel = equipamentosContrato[countEquipamentosContrato];

        addItemListaEquipamentos(eqpSel);
        countEquipamentosContrato++;
    }
}

function addItemListaEquipamentos(eqpSel, adicionado = false) {
    eqpSel.TIPOCONTRATO = $("#modeloContrato").val() + " - " + $("#selectOptLocEquipamento").val();

    var li =
        '<li id="itemSuprimento_' + eqpSel.ID + '">\
                    <div class="card card-horizontal">\
                        <div class="itens-equipamentos">\
                            <div class="line col-md-12 col-lg-12 col-sm-12">\
                                <dl class="mg-3">\
                                    <dt class="text-warning"><strong>' + (adicionado ? "NOVO" : "") + '</strong></dt>\
                                    <dd><button class="btn btn-link" id="btnDetalhesEquip_' + eqpSel.ID + '">\
                                    <i id="iconMaisEquip_' + eqpSel.ID + '" class="flaticon flaticon-square-plus icon-md" aria-hidden="true"></i>\
                                    <i id="iconMenosEquip_' + eqpSel.ID + '" style="display: none" class="flaticon flaticon-minus-box icon-md" aria-hidden="true"></i>\
                                    </button></dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Prefixo:</dt>\
                                    <dd>' + (eqpSel.PREFIXO ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Descrição:</dt>\
                                    <dd>' + (eqpSel.DESCRICAO ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Marca:</dt>\
                                    <dd>' + (eqpSel.FABRICANTE ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Modelo:</dt>\
                                    <dd>' + (eqpSel.MODELO ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Valor do Equipamento:</dt>\
                                    <dd>' + currencySpan(eqpSel.VALOR) + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Valor de Locação:</dt>\
                                    <dd>' + currencySpan(eqpSel.VALORLOCACAO) + '</dd>\
                                </dl>\
                            </div>\
                            <div id="detalhesEquipamentos_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                <dl class="mg-3">\
                                    <dt>Tipo Contrato:</dt>\
                                    <dd>' + (eqpSel.TIPOCONTRATO ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Fornecedor:</dt>\
                                    <dd>' + (eqpSel.FORNECEDOR ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Classe Mecânica:</dt>\
                                    <dd>' + (eqpSel.CLASSMECANICA ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Classe Operacional:</dt>\
                                    <dd>' + (eqpSel.CLASSOPERACIONAL ?? "") + '</dd>\
                                </dl>\
                            </div>\
                            <div id="detalhesEquipamentos_2_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                <dl class="mg-3">\
                                    <dt>Ano Fabricação:</dt>\
                                    <dd>' + (eqpSel.ANO ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Ano Modelo:</dt>\
                                    <dd>' + (eqpSel.ANOMODELO ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Chassi:</dt>\
                                    <dd>' + (eqpSel.CHASSI ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Placa/Série:</dt>\
                                    <dd>' + (eqpSel.PLACA ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Potência do Motor:</dt>\
                                    <dd>' + (eqpSel.POTENCIA ?? "") + '</dd>\
                                </dl>\
                                <dl class="mg-3">\
                                    <dt>Capacidade:</dt>\
                                    <dd>' + (eqpSel.CAPACIDADE ?? "") + '</dd>\
                                </dl>\
                            </div>\
                            <div id="panelEquipSuprimento_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                <div class="panel panel-primary width100">\
                                    <div class="panel-heading">Suprimentos - Controle de Equipamentos</div>\
                                    <div class="panel-body">\
                                        <div id="formSuprimento_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                            <dl class="mg-3">\
                                                <dt>Valor FIPE:</dt>\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><strong>R$</strong></span>\
                                                    <dd><input type="text" class="form-control" id="suprimentoValorFipe_' + eqpSel.ID + '"\></dd>\
                                                </div>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Valor implemento:</dt>\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><strong>R$</strong></span>\
                                                    <dd><input type="text" class="form-control" id="suprimentoValorImplemento_' + eqpSel.ID + '"\></dd>\
                                                </div>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Valor implemento depreciado:</dt>\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><strong>R$</strong></span>\
                                                    <dd><input type="text" disabled class="form-control" id="suprimentoValorImplementoDepreciado_' + eqpSel.ID + '"\></dd>\
                                                </div>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Avaliação do Bem:</dt>\
                                                <div class="input-group">\
                                                    <dd><input type="text" disabled class="form-control" id="suprimentoAvaliacaoBem_' + eqpSel.ID + '"\></dd>\
                                                    <span class="input-group-addon"><strong>%</strong></span>\
                                                    <span class="input-group-addon"><strong></strong><i id="iconSuprimento"></i></span>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Preço Equipamento:</dt>\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><strong>R$</strong></span>\
                                                    <dd><input type="text" disabled class="form-control" id="suprimentoPrecoEquipamento_' + eqpSel.ID + '"\></dd>\
                                                </div>\
                                            </dl>\
                                        </div>\
                                        <div id="formSuprimento_2_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                            <dl class="mg-3">\
                                                <dt>Referência:</dt>\
                                                <dd><input type="text" class="form-control" id="suprimentoReferencia_' + eqpSel.ID + '"\></dd>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Prazo contrato:</dt>\
                                                <dd><input name="suprimentoPrazoContrato_' + eqpSel.ID + '" id="suprimentoAte2Meses' + eqpSel.ID + '" type="radio" value="Até 2 meses"> Até 2 Meses <input name="suprimentoPrazoContrato_' + eqpSel.ID + '" id="suprimentoMais2Meses' + eqpSel.ID + '" type="radio" value="Mais 2 meses"> Mais de dois Meses </dd>\
                                            </dl>\
                                            <dl class="mg-3" id="divPrazoMesesSuprimento_' + eqpSel.ID + '">\
                                                <dt>Prazo (Meses):</dt>\
                                                <dd><input type="number" min="3" class="form-control" id="suprimentoPrazoMeses_' + eqpSel.ID + '"\></dd>\
                                            </dl>\
                                        </div>\
                                        <div id="formSuprimento_3_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                            <dl class="mg-3">\
                                                <dt>Observações:</dt>\
                                                <dd><textarea class="form-control" id="suprimentoObservacoes_' + eqpSel.ID + '" rows="5" cols="2" maslength="255"></textarea></dd>\
                                            </dl>\
                                        </div>\
                                        <div id="viewSuprimento_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                            <dl class="mg-3">\
                                                <dt>Valor FIPE:</dt>\
                                                <dd>' + currencySpan(eqpSel.FIPE ?? 0) + '</dd>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Valor implemento:</dt>\
                                                <dd>' + currencySpan(eqpSel.VALORIMPLEMENTO ?? 0) + '</dd>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Valor implemento depreciado:</dt>\
                                                <dd>' + currencySpan(eqpSel.VALORIMPLEMENTODEPRECIADO ?? 0) + '</dd>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Avaliação do Bem:</dt>\
                                                <dd>' + percentSpan(eqpSel.AVALIACAOBEM ?? 0) + '&nbsp' +
                                                    (eqpSel.AVALIACAOBEM > 5
                                                    ? '<i class="text-success fluigicon fluigicon-circle-arrow-down icon-sm" aria-hidden="true"></i>'
                                                    : '<i class="text-danger fluigicon fluigicon-circle-arrow-up icon-sm" aria-hidden="true"></i>') +
                                                '</dd>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Preço Equipamento:</dt>\
                                                <dd>' + currencySpan(eqpSel.PRECOEQUIPAMENTO ?? 0) + '</dd>\
                                            </dl>\
                                        </div>\
                                        <div id="viewSuprimento_2_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                            <dl class="mg-3">\
                                                <dt>Referência:</dt>\
                                                <dd>' + (eqpSel.REFERENCIA ?? "") + '</dd>\
                                            </dl>\
                                            <dl class="mg-3">\
                                                <dt>Prazo contrato:</dt>\
                                                <dd>' + (eqpSel.PRAZOCONTRATO ?? "") + '</dd>\
                                            </dl>\
                                            <dl id="viewPrazoMesesSuprimento_' + eqpSel.ID + '" class="mg-3">\
                                                <dt>Prazo (Meses):</dt>\
                                                <dd>' + (eqpSel.PRAZOMESES ?? "") + '</dd>\
                                            </dl>\
                                        </div>\
                                        <div id="viewSuprimento_3_' + eqpSel.ID + '" class="line col-md-12 col-lg-12 col-sm-12">\
                                            <dl class="mg-3">\
                                                <dt>Observações:</dt>\
                                                <dd>' + (eqpSel.OBSERVACOES ?? "") + '</dd>\
                                            </dl>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </li>';

    $("#listaEquipamentosContrato").append(li);

    $("#panelEquipSuprimento_" + eqpSel.ID + ",#detalhesEquipamentos_" + eqpSel.ID + ",#detalhesEquipamentos_2_" + eqpSel.ID + ",#formSuprimento_" + eqpSel.ID + ",#viewSuprimento_" + eqpSel.ID + ",#formSuprimento_2_" + eqpSel.ID + ",#formSuprimento_3_" + eqpSel.ID + ",#viewSuprimento_2_" + eqpSel.ID + ",#viewSuprimento_3_" + eqpSel.ID + ",#iconMenosEquip_" + eqpSel.ID).hide();
    $("#iconMaisEquip_" + eqpSel.ID).show();
    $("#divPrazoMesesSuprimento_" + eqpSel.ID).hide();
    $("#suprimentoTipoContrato_" + eqpSel.ID).val(eqpSel.TIPOCONTRATO);

    var lastLi = $("#listaEquipamentosContrato").find("li:last");

    onInputPropSuprimento('suprimentoValorFipe_' + eqpSel.ID, 'FIPE', lastLi, 'objetoEquipamentos', true);
    onInputPropSuprimento('suprimentoValorImplemento_' + eqpSel.ID, 'VALORIMPLEMENTO', lastLi, 'objetoEquipamentos', true);
    onInputPropSuprimento('suprimentoReferencia_' + eqpSel.ID, 'REFERENCIA', lastLi, 'objetoEquipamentos');
    onInputPropSuprimento('suprimentoPrazoMeses_' + eqpSel.ID, 'PRAZOMESES', lastLi, 'objetoEquipamentos');
    onInputPropSuprimento('suprimentoObservacoes_' + eqpSel.ID, 'OBSERVACOES', lastLi, 'objetoEquipamentos');

    lastLi.find('input[name="suprimentoPrazoContrato_' + eqpSel.ID + '"]').on('change', function () {
        var li = $(this).closest("li");
        var id = li.attr("id");

        var id = id.replace('itemSuprimento_', '');

        if (id && id > 0) {
            let itens = JSON.parse($("#objetoEquipamentos").val());
            let itemFiltrado = itens.filter(a => a.ID == id);
            if (itemFiltrado.length > 0) {
                itemFiltrado[0].PRAZOCONTRATO = $(this).val();
            }

            if ($(this).val() == "Mais 2 meses") {
                $("#divPrazoMesesSuprimento_" + id).show();
                $("#viewPrazoMesesSuprimento_" + id).show();
            } else {
                $("#divPrazoMesesSuprimento_" + id).hide();
                $("#viewPrazoMesesSuprimento_" + id).hide();
                $("#suprimentoPrazoMeses_" + id).val(0);
                itemFiltrado[0].PRAZOMESES = 0;
            }

            $("#objetoEquipamentos").val(JSON.stringify(itens));
        }
    });

    lastLi.find("#btnDetalhesEquip_" + eqpSel.ID).on('click', function () {
        var li = $(this).closest("li");
        var id = li.attr("id");
        var id = id.replace('itemSuprimento_', '');

        let elemento = $("#detalhesEquipamentos_" + id);
        if (elemento.css("display") === "none") {
            $("#detalhesEquipamentos_" + id + ",#iconMenosEquip_" + id + ",#detalhesEquipamentos_2_" + id).show();
            if ($("#atividade").val() == 100) {
                $("#panelEquipSuprimento_" + id + ",#formSuprimento_" + id + ",#formSuprimento_2_" + id + ",#formSuprimento_3_" + id).show();
            } else if ($("#atividade").val() != 9 && $("#atividade").val() != 23 && $("#atividade").val() != 101) {
                $("#panelEquipSuprimento_" + id + ",#viewSuprimento_" + id + ",#viewSuprimento_2_" + id + ",#viewSuprimento_3_" + id).show();
            }
            $("#iconMaisEquip_" + id).hide();
        } else {
            $("#panelEquipSuprimento_" + id + ",#detalhesEquipamentos_" + id + ",#detalhesEquipamentos_2_" + id + ",#formSuprimento_" + id + ",#viewSuprimento_" + id + ",#formSuprimento_2_" + id + ",#formSuprimento_3_" + id + ",#viewSuprimento_2_" + id + ",#viewSuprimento_3_" + id + ",#iconMenosEquip_" + id).hide();
            $("#iconMaisEquip_" + id).show();
        }
    })
}

function onInputPropSuprimento(prop, atributo, last, propItens, isCurrency = false){
    last.find('#'+prop).on('input', function() {
        var li = $(this).closest("li");
		var id = li.attr("id");

        var id = id.replace('itemSuprimento_','');

        if (id && id > 0){
            let itens = JSON.parse($("#" + propItens).val());
            let itemFiltrado = itens.filter(a => a.ID == id);
            if (itemFiltrado.length > 0){
                if (isCurrency){
                    let item = itemFiltrado[0];
                    let currency = formatarCurrency($(this).val());
                    
                    item[atributo] = currency.valor;
                    $(this).val(currency.textInput);
                
                    item.VALORIMPLEMENTODEPRECIADO = Number(parseFloat((item.VALORIMPLEMENTO / 2) ?? 0).toFixed(2));
                    
                    item.PRECOEQUIPAMENTO = (item.FIPE ?? 0) + item.VALORIMPLEMENTODEPRECIADO;
                                        
                    item.AVALIACAOBEM = Number(parseFloat(item.PRECOEQUIPAMENTO > 0 ? (Number(item.VALORLOCACAO) / item.PRECOEQUIPAMENTO) * 100 : 0).toFixed(2));

                    if (item.AVALIACAOBEM > 5){
                        $("#iconSuprimento").removeClass("text-success fluigicon fluigicon-circle-arrow-down icon-sm");
                        $("#iconSuprimento").addClass("text-danger fluigicon fluigicon-circle-arrow-up icon-sm");
                    } else {
                        $("#iconSuprimento").removeClass("text-danger fluigicon fluigicon-circle-arrow-up icon-sm");
                        $("#iconSuprimento").addClass("text-success fluigicon fluigicon-circle-arrow-down icon-sm");
                    }

                    $("#suprimentoAvaliacaoBem_" + id).val(formatarPercentual(item.AVALIACAOBEM.toFixed(2)).textInput);
                    $("#suprimentoPrecoEquipamento_" + id).val(formatarCurrency(item.PRECOEQUIPAMENTO.toFixed(2)).textInput);
                    $("#suprimentoValorImplementoDepreciado_" + id).val(formatarCurrency(item.VALORIMPLEMENTODEPRECIADO.toFixed(2)).textInput);
                } else {
                    itemFiltrado[0][atributo] = $(this).val();
                }
            }

            $("#" + propItens).val(JSON.stringify(itens));
        }
    })
}

function atualizarListEquipamentos(cnpj) {
    var obra = $("#hiddenCODGCCUSTO").val();
    var c1 = DatasetFactory.createConstraint("OPERACAO", "SELECTWHEREOBRAECNPJ", "SELECTWHEREOBRAECNPJ", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODCCUSTO", obra, obra, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("CNPJ", cnpj, cnpj, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2, c3], null);

    dataTable.clear().draw();
    $("#btnAdicionarEquipamento").hide();
    $("#btnAdicionarEquipamento_1").hide();
    dataTable.rows.add(ds.values); // Add new data
    dataTable.columns.adjust().draw(); // Redraw the DataTable
    $("#tableEquipamentos").css("width", "100%");
    CarregaListaEquipamentos();
}

function preencherEquipamentos(obra, contrato) {
    if ($("#preenchidoBodyEquipamentos").val()){
        return;
    }
    
    var c1 = DatasetFactory.createConstraint("OPERACAO", "SELECTWHERECONTRATOEOBRA", "SELECTWHERECONTRATOEOBRA", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODCCUSTO", obra, obra, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("CODCONTRATO", contrato, contrato, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2, c3], null);

    var itens = ds.values;
    $("#equipamentosContrato").val(JSON.stringify(itens));

    for (var i = 0; i < itens.length; i++){
        var values = itens[i];
        var html =
            "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
            <td class='tableTd'>" + values.PREFIXO + "</td>\
            <td class='tableTd'>" + values.DESCRICAO + "</td>\
            <td class='tableTd'>" + values.FABRICANTE + "</td>\
            <td class='tableTd'>" + values.MODELO + "/" + values.ANO + "</td>\
            <td class='tableTd'>";
        var htmlAdt =
            "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
            <td class='tableTd'>" + values.PREFIXO + "</td>\
            <td class='tableTd'>" + values.DESCRICAO + "</td>\
            <td class='tableTd'>" + values.FABRICANTE + "</td>\
            <td class='tableTd'>" + values.MODELO + "/" + values.ANO + "</td>\
            <td class='tableTd'>";
                            
            if ((values.PLACA ?? "") != "") {
                html += values.PLACA;
                htmlAdt += values.PLACA;
            } else {
                html += "";
                htmlAdt += "";
            }
                            
            html += "</td>";
            htmlAdt += "</td>";
                            
            html += "<td class='tableTd'>";
            htmlAdt += "<td class='tableTd'>";
                            
            if ((values.CHASSI ?? "") != "") {
                html += values.CHASSI;
                htmlAdt += values.CHASSI;
            } else {
                html += "";
                htmlAdt += "";
            }

            html += "</td>\
                <td class='tableTd'>" + (values.POTENCIA ?? "") + "</td>\
                <td class='tableTd'>" + (values.CAPACIDADE ?? "") + "</td>\
                <td class='tableTd'>" + (values.UNIDADE ?? "") + "</td>";
            htmlAdt += "</td>\
                <td class='tableTd'>" + (values.POTENCIA ?? "") + "</td>\
                <td class='tableTd'>" + (values.CAPACIDADE ?? "") + "</td>\
                <td class='tableTd'>" + (values.UNIDADE ?? "") + "</td>";         
            html += "<td class='tableTd'>";
            htmlAdt += "<td class='tableTd'>";
            var element = document.getElementById("selectOptAditivoNatLocEquip");
            var valorSel = element.options[element.selectedIndex].value;  

            var valor = FormataValor(values.VALORLOCACAO)
                            
            valor = valor.substring(3, valor.length)
            if(valorSel=="Alteracao de Prazo e Valor" || valorSel=="Alteracao de Valor"){
                html += valor + "</td>"
                htmlAdt += '<input type="text" name="valorAdit" id="valorAdit" class="campoContrato resize form-control" style="display: inline-block;" value="'+valor+'" /></td>'
            }else{
                html += valor + "</td>"
                htmlAdt += valor + "</td>"
            }     
            
            
            
            if ($("#selectOptAditivoNatLocEquip").val() == "Exclusao de Equipamento"){
                var prefixoStr = "'" + values.PREFIXO + "'";
                html += '<td><input type="checkbox" id="checkboxRemover' + values.PREFIXO.replace(".", "") + '" onchange="selecionarItemExclusao(' + prefixoStr + ', this)"></td>'
                htmlAdt += '<td><input type="checkbox" id="checkboxRemover' + values.PREFIXO.replace(".", "") + '" onchange="selecionarItemExclusao(' + prefixoStr + ', this)"></td>'
            }

            html +="</tr>";
            htmlAdt +="</tr>";       
            $("#tbody").append(html); 
            if(valorSel=="Alteracao de Prazo e Valor" || valorSel=="Alteracao de Valor"){
                $("#tbody_1").append(htmlAdt); 
            }
    }      
}

function selecionarItemExclusao(prefixo, checkbox) {
    if (checkbox.checked) {
        // Adicionar linha na tabela de remoção
        let tr = $(".linhaEquipamento" + prefixo.replace('.', '')).closest("tr");
        let row = tr[0];
        let values = [];

        $(row).find('td').each(function () {
            values.push($(this).text());
        });

        let newRow = "<tr class='linhaRemove" + prefixo.replace('.', '') + "'>";
        let itemRemocao = {
            PREFIXO: values[0],
            DESCRICAO: values[1],
            FABRICANTE: values[2],
            MODELO: values[3],
            PLACA: values[4],
            RENAVAN: values[5],
            CHASSI: values[6],
            VALOR: values[7]
        };
        for (let i = 0; i < values.length; i++) {
            newRow += "<td>" + values[i] + "</td>";
        }
        newRow += "</tr>";

        let equipamentos = [];

        if(!$("#objetoEquipamentos").val()){
            equipamentos.push(itemRemocao);
        } else {
            equipamentos = JSON.parse($("#objetoEquipamentos").val());
            equipamentos.push(itemRemocao);
        }

        $("#objetoEquipamentos").val(JSON.stringify(equipamentos));

        $("#tabelaRemove").find("tbody").append(newRow);
    } else {
        // Remover linha da tabela de remoção
        let equipamentos = JSON.parse($("#objetoEquipamentos").val());
        equipamentos = equipamentos.filter(a => a.PREFIXO != prefixo);
        $("#objetoEquipamentos").val(JSON.stringify(equipamentos));
        $(".linhaRemove" + prefixo.replace('.', '')).remove();
    }
}

function VerificaAlteracaoNoEquipamento() {
    var listDif = [];
    var listEqp = [];
    $("#tbodyEquipamentos")
        .find(".checkboxEqp:checked")
        .each(function () {
            var tr = $(this).closest("tr");
            var row = dataTable.row(tr);
            var values = row.data();

            var json = {
                PREFIXO: values.PREFIXO,
                OBRA: values.OBRA,
                CHASSI: $("#Chassi_" + values.PREFIXO.replace(".", "")).val(),
                PLACA: $("#Placa_" + values.PREFIXO.replace(".", "")).val(),
                CPFCNPJ: values.CPFCNPJ,
                FORNECEDOR: values.FORNECEDOR,
                FABRICANTE: $("#Fabricante_" + values.PREFIXO.replace(".", "")).val(),
                ANO: $("#Ano_" + values.PREFIXO.replace(".", "")).val(),
                MODELO: $("#Modelo_" + values.PREFIXO.replace(".", "")).val(),
                DESCRICAO: $("#Descricao_" + values.PREFIXO.replace(".", "")).val(),
                VALOR: $("#Valor_" + values.PREFIXO.replace(".", "")).val(),
                VALORLOCACAO: $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).val()
            };
            listEqp.push(json);

            var prefixo = values.PREFIXO.replace(".", "");

            var jsonDif = {};
            if ($("#Modelo_" + prefixo).val() != values.MODELO) {
                jsonDif.modelo = $("#Modelo_" + prefixo).val();
                jsonDif.modeloPrev = values.MODELO;
            }
            if ($("#Descricao_" + prefixo).val() != values.DESCRICAO) {
                jsonDif.descricao = $("#Descricao_" + prefixo).val();
                jsonDif.descricaoPrev = values.DESCRICAO;
            }

            var valorLocacao = $("#ValorLocacao_" + prefixo).val();
            if ($("#ValorLocacao_" + prefixo).val() != values.VALORLOCACAO) {
                jsonDif.valorLocacao = $("#ValorLocacao_" + prefixo).val();
                jsonDif.valorLocacaoPrev = values.VALORLOCACAO;
            }
            if ($("#Valor_" + prefixo).val() != values.VALOR) {
                jsonDif.valor = $("#Valor_" + prefixo).val();
                jsonDif.valorPrev = values.VALOR;
            }
            if ($("#Placa_" + prefixo).val() != values.PLACA) {
                jsonDif.placa = $("#Placa_" + prefixo).val();
                jsonDif.placaPrev = values.PLACA;
            }
            if ($("#Chassi_" + prefixo).val() != values.CHASSI) {
                jsonDif.chassi = $("#Chassi_" + prefixo).val();
                jsonDif.chassiPrev = values.CHASSI;
            }
            if ($("#Fabricante_" + prefixo).val() != values.FABRICANTE) {
                jsonDif.fabricante = $("#Fabricante_" + prefixo).val();
                jsonDif.fabricantePrev = values.FABRICANTE;
            }
            if ($("#Ano_" + prefixo).val() != values.ANO) {
                jsonDif.ano = $("#Ano_" + prefixo).val();
                jsonDif.anoPrev = values.ANO;
            }

            if (JSON.stringify(jsonDif) != "{}") {
                jsonDif.prefixo = values.PREFIXO;
                listDif.push(jsonDif);
            }
        });


        if (JSON.stringify(listEqp) != "[]") {
        $("#equipamentosSel").val(JSON.stringify(listEqp));
        $("#itensContrato").val(JSON.stringify(listEqp));
    }

    if (JSON.stringify(listDif) != "[]") {
        $("#alteracoesEquipamentos").val(JSON.stringify(listDif));

        AtualizaEquipamentos();
    }
}

function SalvaEquipamentosIncluidos() {
    var headers = [];
    $("#tabelaEquipamentos").find("thead").find("th").each(function () {
        headers.push($(this).text());
    })

    var headersAdtv = [];
    $("#tabelaEquipamentosAditivo").find("thead").find("th").each(function () {
        headersAdtv.push($(this).text());
    })

    var json = [];
    $("#tabelaEquipamentos").find("tbody").find("tr").each(function (i) {
        if ($(this).hasClass("trEquipamento")) {
            json.push({});
        }
    });
    
    var jsonAdtv = [];
    $("#tabelaEquipamentosAditivo").find("tbody").find("tr").each(function (i) {
        if ($(this).hasClass("trEquipamento")) {
            jsonAdtv.push({});
        }
    });
}

function exibirColunaExclusao() {
    
}

function AtualizaEquipamentos() {
    var equipamentos = $("#alteracoesEquipamentos").val();
    var c1 = DatasetFactory.createConstraint("OPERACAO", "ATUALIZAEQUIPAMENTO", "ATUALIZAEQUIPAMENTO", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("JSONEQUIPAMENTO", equipamentos, equipamentos, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2], null);
}