// $slider.slick('slickGoTo', 3);
// $slider.slick('slickNext');
// $slider.slick('slickPrev');
// var currentSlide = $slider.slick('slickCurrentSlide');

var canChange = true;
var errowMessage;
var parametros;
var stack = [];
     
window.onerror = function(msg, url, line, col, error) {
    if (errowMessage === "Erro de validação") {
        errowMessage = undefined;
        canChange = false;
        validaSlide(parametros.slick, parametros.currentSlide, parametros.nextSlide);
        return true;  //  silent the error, and keep functioning as normal
    }
}

function sliderBeforeChange(event, slick, currentSlide, nextSlide){
    console.log("sliderBeforeChange", canChange);
    if(canChange){
        errowMessage = "Erro de validação";
        parametros = {slick: slick, currentSlide: currentSlide, nextSlide: nextSlide};
        throw "";
    }
}

function sliderAfterChange(event, slick, currentSlide, nextSlide){
    canChange = true;
    console.log("sliderBeforeChange", canChange);
}

function validaSlide(slick, currentSlide, nextSlide){
    if(currentSlide > nextSlide){        
        var slideNumber = stack[stack.length - 1];
        stack.pop();
        $slider.slick('slickGoTo', slideNumber);
        return ;
    }

    var exigeValidacao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaNenhum");
    console.log("exigeValidacao", exigeValidacao.length);
    if(exigeValidacao.length){
        var element = $("#sessao"+sessao+"Slide" +currentSlide+ " > .form-check");
        var opcao =  $(element).find("input[name='"+ element.data( "name" ) +"']:checked").val();
        console.log("opcao", opcao, element.data( "name" ));
        if(opcao == "0"){
            stack.push(currentSlide);
            $slider.slick('slickGoTo', currentSlide + 2);
        }
        else if(opcao){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
        
        return ;
    }

    var elementosObrigatorios = $("#sessao"+sessao+"Slide" +currentSlide+ " > .required");
    console.log("elementosObrigatorios", elementosObrigatorios.length);
    if(elementosObrigatorios.length){
        var slideValido = true;
        elementosObrigatorios.each(function(index, element){
            var opcao = $(element).find("input[name='radioS"+sessao +"S"+currentSlide+"Q"+index+"']:checked").val();
            console.log("opcao", opcao);
            if(!opcao)
                slideValido = false;
        });
        console.log("slideValido", slideValido);
        if(slideValido){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
        
        return ;
    }
    
    var selectValidacao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredSelect");
    console.log("selectValidacao", selectValidacao.length);
    if(selectValidacao.length){
        var horas = $("#" + $(selectValidacao[0]).data("id")).val();
        var minutos = $("#" + $(selectValidacao[1]).data("id")).val();
        console.log("slideValido", horas, minutos);
        if((horas != "-1" && minutos != "-1") && (horas != "0" || minutos != "0") && (horas != "24" || minutos == "0")){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
        
        return ;
    }

    var validaSimNao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaSimNao");
    console.log("validaSimNao", validaSimNao.length);
    if(validaSimNao.length){
        var slideValido = true;
        var opcao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaSimNao > .form-check > input[name='ipac_1a']:checked").val();
        console.log("opcao", opcao);
        if(opcao == "true"){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else if(opcao == "nao"){
            window.location = "sessaoDois.html";
        }
        else
            canChange = true;
        
        return ;
    }

    var validaForm1 = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1");
    console.log("validaForm1", validaForm1.length);
    if(validaForm1.length){
        var nome = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #inputNome").val();
        var email = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #inputEmail").val();
        var idade = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #inputIdade").val();
        var sexo = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > input[name='radioSexo']:checked").val();
        console.log("opcao", nome, email, parseInt(idade), sexo);
        if(nome && email && parseInt(idade) && sexo){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;

        return ;
    }

    var validaForm2 = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2");
    console.log("validaForm2", validaForm2.length);
    if(validaForm2.length){
        var rendaFamiliar = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2 > #selectRendaFamiliar").val();
        var nivelEscolaridade = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2 > #selectNivelEscolaridade").val();
        console.log("opcao", rendaFamiliar, nivelEscolaridade);
        if(rendaFamiliar != "-1" && nivelEscolaridade != "-1"){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;

        return ;
    }

    var validamapa = $("#sessao"+sessao+"Slide" +currentSlide+ " > #map");
    console.log("validamapa", validamapa.length);
    if(validamapa.length){
        var peloMenosUmLocal = overlays.find(function(marcacao){
            return marcacao.getMap();
        })
        console.log("peloMenosUmLocal", peloMenosUmLocal);
        if(peloMenosUmLocal){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;

        return ;
    }

    stack.push(currentSlide);
    $slider.slick('slickNext');        
}

$("input").change(function(){
    console.log("marcou");
    validaSlide(undefined, $slider.slick("slickCurrentSlide"), $slider.slick("slickCurrentSlide")+1);
})

$("select").change(function(){
    console.log("marcou");
    validaSlide(undefined, $slider.slick("slickCurrentSlide"), $slider.slick("slickCurrentSlide")+1);
})


function Respostas(){
    this.ipac_1a = getByName("ipac_1a");
    this.ipac_1b = getByName("ipac_1b");
    this.ipac_1c = getBySelect("ipac_1c");
    this.ipac_1d = getByName("ipac_1d");
    this.ipac_1e = getBySelect("ipac_1e");
    this.ipac_1f = getByName("ipac_1f");
    this.ipac_1g = getBySelect("ipac_1g");

    this.ipac_2a = getByName("ipac_2a");
    this.ipac_2b = getBySelect("ipac_2b");
    this.ipac_2c = getByName("ipac_2c");
    this.ipac_2d = getBySelect("ipac_2d");
    this.ipac_2e = getByName("ipac_2e");
    this.ipac_2f = getBySelect("ipac_2f");

    this.ipac_3a = getByName("ipac_3a");
    this.ipac_3b = getBySelect("ipac_3b");
    this.ipac_3c = getByName("ipac_3c");
    this.ipac_3d = getBySelect("ipac_3d");
    this.ipac_3e = getByName("ipac_3e");
    this.ipac_3f = getBySelect("ipac_3f");

    this.ipac_4a = getByName("ipac_4a");
    this.ipac_4b = getBySelect("ipac_4b");
    this.ipac_4c = getByName("ipac_4c");
    this.ipac_4d = getBySelect("ipac_4d");
    this.ipac_4e = getByName("ipac_4e");
    this.ipac_4f = getBySelect("ipac_4f");

    this.ipac_5a = getBySelect("ipac_5a");
    this.ipac_5b = getBySelect("ipac_5b");

}

function getByName(name){
    return $("input[name='" + name + "']:checked").val();
}

function getBySelect(id){
    return $("#" + id + "_h").val() + ":" + $("#" + id + "_m").val();
}
