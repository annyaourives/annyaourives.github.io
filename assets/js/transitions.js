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
            var opcao = $(element).find("input[name='"+ $(element).data( "name" ) + "']:checked").val();
            // var opcao = $(element).find("input[name='radioS"+sessao +"S"+currentSlide+"Q"+index+"']:checked").val();
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
        var nome = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #name").val();
        var email = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #email").val();
        var idade = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > #age").val();
        var sexo = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm1 > input[name='sex']:checked").val();
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
        var rendaFamiliar = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2 > #family_income").val();
        var nivelEscolaridade = $("#sessao"+sessao+"Slide" +currentSlide+ " > .requiredForm2 > #educational_level").val();
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

var startTime = new Date();
function Respostas(){
    this.name = getByText('name');
    this.email = getByText('email');
    this.age = getByText('age');
    this.sex = getByName('sex');
    this.family_income = getBySelect('family_income');
    this.educational_level = getBySelect('educational_level');
    this.duration = (Date.now() - startTime.getTime())/1000;

    // var tt = document.getElementById('Startdate').val();
    // var diff = Date.now() - new Date(tt).getTime();
    // var seconds = diff/1000;
    // var minutes = diff/60000;
    // var hours = diff/3600000;
    // var days = diff/86400000;
}

function RespostasIpac(){
    this.ipac_1a = getByName("ipac_1a");
    this.ipac_1b = getByName("ipac_1b");
    this.ipac_1c = getBySelect_time("ipac_1c");
    this.ipac_1d = getByName("ipac_1d");
    this.ipac_1e = getBySelect_time("ipac_1e");
    this.ipac_1f = getByName("ipac_1f");
    this.ipac_1g = getBySelect_time("ipac_1g");

    this.ipac_2a = getByName("ipac_2a");
    this.ipac_2b = getBySelect_time("ipac_2b");
    this.ipac_2c = getByName("ipac_2c");
    this.ipac_2d = getBySelect_time("ipac_2d");
    this.ipac_2e = getByName("ipac_2e");
    this.ipac_2f = getBySelect_time("ipac_2f");

    this.ipac_3a = getByName("ipac_3a");
    this.ipac_3b = getBySelect_time("ipac_3b");
    this.ipac_3c = getByName("ipac_3c");
    this.ipac_3d = getBySelect_time("ipac_3d");
    this.ipac_3e = getByName("ipac_3e");
    this.ipac_3f = getBySelect_time("ipac_3f");

    this.ipac_4a = getByName("ipac_4a");
    this.ipac_4b = getBySelect_time("ipac_4b");
    this.ipac_4c = getByName("ipac_4c");
    this.ipac_4d = getBySelect_time("ipac_4d");
    this.ipac_4e = getByName("ipac_4e");
    this.ipac_4f = getBySelect_time("ipac_4f");

    this.ipac_5a = getBySelect_time("ipac_5a");
    this.ipac_5b = getBySelect_time("ipac_5b");

}

function RespostasNews(){
    this.news_b1 = getByName('news_b1');
    this.news_b2 = getByName('news_b2');
    this.news_b3 = getByName('news_b3');
    this.news_b4 = getByName('news_b4');
    this.news_b5 = getByName('news_b5');
    this.news_b6 = getByName('news_b6');
    this.news_b7 = getByName('news_b7');
    this.news_b8 = getByName('news_b8');
    this.news_b9 = getByName('news_b9');
    this.news_b10 = getByName('news_b10');
    this.news_b11 = getByName('news_b11');
    this.news_b12 = getByName('news_b12');
    this.news_b13 = getByName('news_b13');
    this.news_b14 = getByName('news_b14');
    this.news_b15 = getByName('news_b15');
    this.news_b16 = getByName('news_b16');
    this.news_b17 = getByName('news_b17');
    this.news_b18 = getByName('news_b18');
    this.news_b19 = getByName('news_b19');
    this.news_b20 = getByName('news_b20');
    this.news_b21 = getByName('news_b21');
    this.news_b22 = getByName('news_b22');
    this.news_b23 = getByName('news_b23');

    this.news_c1 = getByName('news_c1');
    this.news_c2 = getByName('news_c2');
    this.news_c3 = getByName('news_c3');
    this.news_c4 = getByName('news_c4');
    this.news_c5 = getByName('news_c5');
    this.news_c6 = getByName('news_c6');
    this.news_c7 = getByName('news_c7');

    this.news_e1 = getByName('news_e1');
    this.news_e2 = getByName('news_e2');
    this.news_e3 = getByName('news_e3');
    this.news_e4 = getByName('news_e4');
    this.news_e5 = getByName('news_e5');

    this.news_f1 = getByName('news_f1');
    this.news_f2 = getByName('news_f2');
    this.news_f3 = getByName('news_f3');
    this.news_f4 = getByName('news_f4');
    this.news_f5 = getByName('news_f5');
    this.news_f6 = getByName('news_f6');

    this.news_g1 = getByName('news_g1');
    this.news_g2 = getByName('news_g2');
    this.news_g3 = getByName('news_g3');
    this.news_g4 = getByName('news_g4');
    this.news_g5 = getByName('news_g5');
    this.news_g6 = getByName('news_g6');
    this.news_g7 = getByName('news_g7');
    this.news_g8 = getByName('news_g8');

    this.news_h1 = getByName('news_h1');
    this.news_h2 = getByName('news_h2');
    this.news_h3 = getByName('news_h3');
    this.news_h4 = getByName('news_h4');
    this.news_h5 = getByName('news_h5');
    this.news_h6 = getByName('news_h6');

    this.news_ia = getByName('news_ia');
    this.news_ib = getByName('news_ib');
    this.news_ic = getByName('news_ic');
    this.news_id = getByName('news_id');
    this.news_ie = getByName('news_ie');
    this.news_if = getByName('news_if');
    this.news_ig = getByName('news_ig');
    this.news_ih = getByName('news_ih');
    this.news_ii = getByName('news_ii');
    this.news_ij = getByName('news_ij');
    this.news_ik = getByName('news_ik');
    this.news_il = getByName('news_il');
    this.news_im = getByName('news_im');
    this.news_in = getByName('news_in');
    this.news_io = getByName('news_io');
    this.news_ip = getByName('news_ip');
    this.news_iq = getByName('news_iq');
    this.news_ir = getByName('news_ir');
}

function getByText(id){
    return $("#" + id).val();
}

function getByName(name){
    return $("input[name='" + name + "']:checked").val();
}

function getBySelect(id){
    return $("#" + id).val();
}

function getBySelect_time(id){
    return $("#" + id + "_h").val() + ":" + $("#" + id + "_m").val();
}
