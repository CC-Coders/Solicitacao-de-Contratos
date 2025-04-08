var servicosFiltrados = [];
var primeiraValidacaoListaVazia = true;
var novoServicoId = null;
var clickOpcao = false;

function iniciarContratoServico(reconstruirItens = false) {
	$("#divNovoServico").append(
		'<label id="nenhumServicoSpan">Nenhum serviço disponivel para esta obra!</label> ' +
		'<div class="row display-flex" id="divAddServico"> ' + 
			'<div class="col-md-4 col-lg-4"> '+
				'<label for="selectServico">Serviço:</label> ' +
				'<div class="select-content">' +
					'<input type="text" id="filtroServico">' +
					'<ul class="options"></ul>' +
				'</div>' +
			'</div> ' +
			'<div class="col-md-2 col-lg-2"> '+
				'<label for="novoServicoUnidade">Unidade</label> ' +
				'<select class="form-control" id="novoServicoUnidade">'+
				'<option value="UN">Unidade</option>' +
				'<option value="HORA">Hora</option>' +
				'<option value="DIA">Dia</option>' +
				'<option value="MÊS">Mês</option>' +
				'<option value="M">M</option>' +
				'<option value="M2">M²</option>' +
				'<option value="M3">M³</option>' +
				'<option value="KM">KM</option>' +
				'<option value="TON">Ton</option>' +
				'</select> '+
			'</div> '+
			'<div class="col-md-2 col-lg-2"> '+
				'<label for="novoServicoValor">Valor unitário:</label> ' +
				'<input class="form-control" id="novoServicoValor"> ' +
			'</div> ' +
			'<div class="col-md-2 col-lg-2"> '+
				'<label for="novoServicoQuantidade">Quantidade:</label> ' +
				'<input class="form-control" id="novoServicoQuantidade"> ' +
			'</div> ' +
			'<div class="col-md-2 col-lg-2"> '+
				'<label for="btnAdicionarServico">Adicionar</label> ' +
				'<button class="btn btn-primary" id="btnAdicionarServico">Adicionar</button> '+
			'</div> '+
		'</div>'
	);

	if (servicosFiltrados.length == 0){
		$("#nenhumServicoSpan").show();
		$("#divAddServico").hide();
	} else {
		$("#nenhumServicoSpan").hide();
		$("#divAddServico").show();
	}

	$("#novoServicoValor").on("input", () => {
		let valorLimpo = $("#novoServicoValor").val().replace(/[^0-9.,]/g, '');
		$("#novoServicoValor").val(valorLimpo);
	});

	$("#novoServicoQuantidade").on("input", () => {
		let valorLimpo = $("#novoServicoValor").val().replace(/[^0-9.,]/g, '');
		$("#novoServicoValor").val(valorLimpo);
	});
	
	$("#selectServico").on("change",() => {
		servico = servicosFiltrados.filter(a => a.IDPROJETO + "-" + a.IDCOMP == $("#selectServico").val());
		if (servico.length > 0){
			servico = servico[0];
			var unidade = servico.UNIDADE.replace("²","2").replace("³","3").trim();
			$("#novoServicoUnidade").val(unidade);
		}
	});

	$(".options").hide();
	$(".options").on('click',() => {
		clickOpcao = true;
	});

	$("#filtroServico").on('input',() => {
		filter();
	});

	$("#filtroServico").on('focus',() => {
		$(".options").show();
	});

	$("#filtroServico").on('blur',() => {
		if (clickOpcao = true){
			return;
		}
		$(".options").hide();
	});
	
	$("#btnAdicionarServico").on("click", () => {
		adicionarServico();
	});

	buscarServicos();
	iniciarInputSelect();
	reconstruirItensTabela();
	validarLista();
}

let contentSelect = null;
let options = null;
let inputSelect = null;

function iniciarInputSelect() {
	contentSelect = document.querySelector(".select-content");
	options = document.querySelector(".select-content .options");
	inputSelect = document.querySelector(".select-content input");

	setServicos(servicosFiltrados);
}

function filter() {
	const arrFilter = Array.from(servicosFiltrados).filter((servico)=>
		servico.SERVICO.toLowerCase().includes(inputSelect.value.toLowerCase())
	);
	setServicos(arrFilter);
}

function setServicos(arr) {
	options.textContent = null;
	const fragment = document.createDocumentFragment();

	arr.forEach((servico) => {
		const li = document.createElement("li");
		li.textContent = servico.SERVICO + ' - ' + servico.UNIDADE;
		li.setAttribute('data-id', servico.IDPROJETO + "-" + servico.IDCOMP);
		fragment.appendChild(li);

		li.onclick = () => {
			inputSelect.value = servico.SERVICO;
			novoServicoId = servico.IDPROJETO + "-" + servico.IDCOMP;
			var unidade = servico.UNIDADE.replace("²","2").replace("³","3").trim();
			$("#novoServicoUnidade").val(unidade);
			$(".options").hide();
		}
	});

	if (arr.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum item encontrado";
    fragment.appendChild(li);
  }

  options.appendChild(fragment);
}

function substringMatcher(obj) {
    return function findMatches(q, cb) {
        var matches, substrRegex;
 
        matches = [];
 
        substrRegex = new RegExp(q, 'i');
 
        $.each(obj, function (i, item) {
			str = item.SERVICO + " - " + item.UNIDADE + " - " + item.VALOR;
            if (substrRegex.test(str)) {
                matches.push({
                    description: str
                });
            }
        });
        cb(matches);
    };
}

function validarLista(){
	if (primeiraValidacaoListaVazia){
		if (!(servicosFiltrados.length > 0)){
			$("#nenhumServicoSpan").show();
			$("#searchServico").hide();
			$("#searchServicoSpan").hide();
			$("#divAddServico").hide();
		} else {
			$("#nenhumServicoSpan").hide();
			$("#divAddServico").show();
		}
		primeiraValidacaoListaVazia = false;
	}
}

function gerarListagemServicos() {
	var elemento = $("#selectServico");
	elemento.empty();

	servicosFiltrados.forEach(servico => {
		elemento.append(
			'<option value="' + servico.IDPROJETO + "-" + servico.IDCOMP + '">' + servico.SERVICO + ' - ' + servico.UNIDADE + '</option>'
		)	
	});
}

function buscarServicos() {
	var query = $("#searchServico").val() ?? "";
	var codigoColigada = $("#codigoColigada").val();
	var codigoCCusto = $("#codigoObra").val();
	var c1 = DatasetFactory.createConstraint("OPERACAO", "BUSCARSERVICOS", "BUSCARSERVICOS", ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("CODCCUSTO", codigoCCusto, codigoCCusto, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("CODIGOCOLIGADA", codigoColigada, codigoColigada, ConstraintType.MUST);
	var c4 = DatasetFactory.createConstraint("PESQUISA", query, query, ConstraintType.MUST);
	var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2, c3, c4], null);
	servicosFiltrados = ds.values;
	validarLista();
	gerarListagemServicos();
}


function adicionarServico() {
	let servicos = $("#novosServicos").val();
	servicos = !servicos || servicos == "" ? [] : JSON.parse(servicos);

	const fornecedor = $("#FornecedorContrato").val();
	const cnpj = $("#FornecedorCGCCFO").val();
	
	let servico = servicosFiltrados.filter(a => a.IDPROJETO + "-" + a.IDCOMP == novoServicoId);
	if (!servico || servico == "" || servico.length == 0) {
		FLUIGC.toast({
			title: "Erro: ",
			message: "Serviço não selecionado.",
			type: "warning"
		});
		return;
	} else {
		servico = servico[0];
	}

	if (servicos.filter(a => a.IDCONSULTA == servico.IDPROJETO + "-" + servico.IDCOMP).length > 0){
		FLUIGC.toast({
			title: "Erro: ",
			message: "Serviço já adicionado",
			type: "warning"
		});
		return;
	}

	const descricao = servico.SERVICO;
	const valor = Number($("#novoServicoValor").val().replace(",","."));
	const unidade = $("#novoServicoUnidade").val();
	const quantidade = Number($("#novoServicoQuantidade").val()).toFixed(2);

	if (!fornecedor || fornecedor == "") {
		FLUIGC.toast({
			title: "Erro: ",
			message: "Fornecedor não informado.",
			type: "warning"
		});
		return;
	}

	if (!quantidade || quantidade == "") {
		FLUIGC.toast({
			title: "Erro: ",
			message: "Fornecedor não informado.",
			type: "warning"
		});
		return;
	}

	if (!cnpj || cnpj == "") {
		FLUIGC.toast({
			title: "Erro: ",
			message: "CNPJ do fornecedor não informado.",
			type: "warning"
		});
		return;
	}

	if (!descricao || descricao == "") {
		FLUIGC.toast({
			title: "Erro: ",
			message: "Descrição do serviço não informada.",
			type: "warning"
		});
		return;
	}

	if (!(valor > 0)) {
		FLUIGC.toast({
			title: "Erro: ",
			message: "Valor do serviço não informado.",
			type: "warning"
		});
		return;
	}

	servicos.push({
		PREFIXO: '',
		DESCRICAO: descricao,
		UNIDADE: unidade,
		VALOR: servico.VALOR,
		CODIGOCONTRATO: '',
		IDSOLICITACAO: 0,
		STATUS: 1,
		VALORLOCACAO: valor,
		FABRICANTE: "",
		CHASSI: "",
		MARCA: "",
		MODELO: "",
		ANO: 0,
		PLACA: "",
		OBRA: $("#obra").val().split('-')[1].trim(),
		FORNECEDOR: fornecedor,
		CNPJ: cnpj,
		TIPO: "SERVICO",
		EXTRA: 0,
		ACUMULADOFISICOANT: 0,
		ACUMULADOFINANCEIROANT: 0,
		IDCONSULTA: novoServicoId,
		QUANTIDADE: quantidade,
		LIMITEVALOR: quantidade * valor
	});


	$("#novosServicos").val(JSON.stringify(servicos));

	let html = '<tr id="' + novoServicoId + '">' +
		'<td class="tableTd" id="tdSDescricao" id="descricao">' + descricao + '</td>' +
		'<td class="tableTd text-center" id="tdSUnidade" id->' + unidade + '</td>' +
		'<td class="tableTd text-center" id="tdSValor">' + Number(valor).toFixed(2) + '</td>' +
		'<td class="tableTd text-center" id="tdSQuantidade">' + Number(quantidade).toFixed(2) + '</td>' +
		'<td class="tableTd text-center" id="tdSTotal">' + Number(quantidade * valor).toFixed(2) + '</td>' +
		"<td class='tableTd th-auto-width'>\
				<button class='btn btn-primary btnRemove' id='btnRemoveServico'><i class='flaticon flaticon-trash icon-md'></i></button>\
			</td>"
	'<tr>';

	$("#tbodyServicosNovos").append(html);

	$("#tbodyServicosNovos").find("tr:last").find("#btnRemoveServico").on("click", function () {
		var tr = $(this).closest("tr"); // Obtém a tr mais próxima
		var id = tr.attr("id"); // Obtém o ID da tr

		let servicosAtuais = $("#novosServicos").val();
		servicosAtuais = !servicosAtuais || servicosAtuais == "" ? [] : JSON.parse(servicosAtuais);
		servicosAtuais = servicosAtuais.filter(a => a.IDCONSULTA != id);

		$("#novosServicos").val(JSON.stringify(servicosAtuais));

		tr.remove();
		let novoValor = Number(servicosAtuais.reduce((acc, item) => acc + item.LIMITEVALOR, 0)).toFixed(2).toString().replace(".",",");
		$("#Valor").val(novoValor);
	});


	$("#novoServicoDescricao").val("");
	$("#novoServicoValor").val("");
	$("#novoServicoQuantidade").val("1");
	$("#filtroServico").val("");
	novoServicoId = null;

	let novoValor = Number(servicos.reduce((acc, item) => acc + item.LIMITEVALOR, 0)).toFixed(2).toString().replace(".",",");
	$("#Valor").val(novoValor);
}

function reconstruirItensTabela() {
	let servicos = $("#novosServicos").val();
	servicos = !servicos || servicos == "" ? [] : JSON.parse(servicos);
	servicos.forEach(item => {
		let html = '<tr id="' + item.IDCONSULTA + '">' +
			'<td class="tableTd" id="tdSDescricao" id="descricao">' + item.DESCRICAO + '</td>' +
			'<td class="tableTd text-center" id="tdSUnidade" id->' + item.UNIDADE + '</td>' +
			'<td class="tableTd text-center" id="tdSValor">' + Number(item.VALORLOCACAO).toFixed(2) + '</td>' +
			'<td class="tableTd text-center" id="tdSQuantidade">' + Number(item.QUANTIDADE).toFixed(2) + '</td>' +
			'<td class="tableTd text-center" id="tdSTotal">' + Number(item.QUANTIDADE * item.VALORLOCACAO).toFixed(2) + '</td>' +
			"<td class='tableTd th-auto-width'>\
					<button class='btn btn-primary btnRemove' id='btnRemoveServico'><i class='flaticon flaticon-trash icon-md'></i></button>\
				</td>"
		'<tr>';

		$("#tbodyServicosNovos").append(html);

		$("#tbodyServicosNovos").find("tr:last").find("#btnRemoveServico").on("click", function () {
			var tr = $(this).closest("tr"); // Obtém a tr mais próxima
			var id = tr.attr("id"); // Obtém o ID da tr

			let servicosAtuais = $("#novosServicos").val();
			servicosAtuais = !servicosAtuais || servicosAtuais == "" ? [] : JSON.parse(servicosAtuais);
			servicosAtuais = servicosAtuais.filter(a => a.IDCONSULTA != id);

			$("#novosServicos").val(JSON.stringify(servicosAtuais));

			tr.remove();
			remontarObjetoNovosServicos();
		});
	})
}

function remontarObjetoNovosServicos() {
	const fornecedor = $("#FornecedorContrato").val();
	const cnpj = $("#FornecedorCGCCFO").val();

	let servicos = [];
	$("#tbodyServicosNovos tr").each(function () {
		var novoServicoId = $(this).find("#id").text();
		var descricao = $(this).find("#tdSDescricao").text();
		var unidade = $(this).find("#tdSUnidade").text();
		var valor = $(this).find("#tdSValor").text();

		servicos.push({
			PREFIXO: '',
			DESCRICAO: descricao,
			UNIDADE: unidade,
			VALOR: 0,
			CODIGOCONTRATO: '',
			IDSOLICITACAO: 0,
			STATUS: 1,
			VALORLOCACAO: valor,
			FABRICANTE: "",
			CHASSI: "",
			MARCA: "",
			MODELO: "",
			ANO: 0,
			PLACA: "",
			OBRA: $("#obra").val().split('-')[1].trim(),
			FORNECEDOR: fornecedor,
			CNPJ: cnpj,
			TIPO: "SERVICO",
			EXTRA: 0,
			ACUMULADOFISICOANT: 0,
			ACUMULADOFINANCEIROANT: 0,
			IDCONSULTA: novoServicoId,
			QUANTIDADE: quantidade,
			LIMITEVALOR: quantidade * valor

		});
	});

	$("#novosServicos").val(JSON.stringify(servicos));
}