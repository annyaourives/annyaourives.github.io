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
    console.log("sliderBeforeChange");
    if(canChange){
        errowMessage = "Erro de validação";
        parametros = {slick: slick, currentSlide: currentSlide, nextSlide: nextSlide};
        throw "";
    }
}

function sliderAfterChange(event, slick, currentSlide, nextSlide){
    canChange = true;
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
        var opcao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .form-check > input[name='inlineRadioOptions']:checked").val();
        console.log("opcao", opcao);
        if(opcao == "opcao0"){
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
    console.log("exigeValidacao", elementosObrigatorios.length);
    if(elementosObrigatorios.length){
        var slideValido = true;
        elementosObrigatorios.each(function(index, element){
            var opcao = $(element).find("input[name='radioS"+sessao +"S"+currentSlide+"Q"+index+"']:checked").val();
            console.log("opcao", opcao);
            if(!opcao)
                slideValido = false;
        });
        if(slideValido){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else
            canChange = true;
    }

    
    var validaSimNao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaSimNao");
    console.log("exigeValidacao", validaSimNao.length);
    if(validaSimNao.length){
        var slideValido = true;
        var opcao = $("#sessao"+sessao+"Slide" +currentSlide+ " > .validaSimNao > .form-check > input[name='trabalha']:checked").val();
        console.log("opcao", opcao);
        if(opcao == "sim"){
            stack.push(currentSlide);
            $slider.slick('slickNext');
        }
        else if(opcao == "nao"){
            window.location = "sessaoDois.html";
        }
        else
            canChange = true;
    }
    else{
        stack.push(currentSlide);
        $slider.slick('slickNext');
    }
}