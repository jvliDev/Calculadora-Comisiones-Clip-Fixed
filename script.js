/* Jvlidev - 2025 */
/* El proposito de esta version es calcular las comisiones para la terminal Clip de forma que calcule el monto final con la diferencia de comision a favor de el vendedor */

document.addEventListener("DOMContentLoaded", function () {

    $(document).ready(function () {
        var height = $(window).height();
        $('#main').height(height);
        window.addEventListener('resize', function () {
            var height = $(window).height();
            $('#main').height(height);
        });
        inicial();
        $("#calc_boton").click(function () {
            if (boton_activo() && boton_es_reiniciar()) {
                $("#calc_boton").attr('data-reiniciar', '0');
                $("#calc_boton").removeClass('activo');
                inicial();
            }
            else if (boton_activo() && !boton_es_reiniciar()) {
                calculo_regular();
            }
        });


    });
    function calculo_regular() {
        porcentaje_de_comision = 3.6;
        porcentaje_de_iva = 16;
        monto = $("#monto").val();
        valor = moneda_to_num(monto);
        valor = valor * 1;
        monto_f = moneda(valor, 3);
        customer_recibe = calculaComisionFix(valor);
        $("#calc_panel").html("<p class='calc_titulo_panel' style='display: block'>Para una venta de $" + monto_f + " cobra</p>");
        customer_recibe_f = moneda(customer_recibe);
        $("#calc_panel").append("<p class='calc_titulo_monto'>$" + customer_recibe_f + "</p>");
        comision_f = moneda(comision);
        $("#calc_panel").append("<div class='calc_fila uno'><p class='uno'>" + porcentaje_de_comision + "%</p><p class='dos'>Comisión por transacción</p><p class='tres'>$" + comision_f + "</p></div");
        iva_f = moneda(iva);
        $("#calc_panel").append("<div class='calc_fila dos'><p class='uno'>" + porcentaje_de_iva + "%</p><p class='dos'>IVA de la comisión</p><p class='tres'>$" + iva_f + "</p></div");
        $("#calc_boton").text("Calcular otra cantidad");
        $("#calc_boton").attr('data-reiniciar', '1');
    }
    function inicial() {
        //$("#calc_panel").html("<p class='calc_titulo_panel'>Ingresa el monto de la venta</p>");
        $("#calc_panel").html("<p class='calc_titulo_panel' style='display: none'></p>");
        $("#calc_panel").append("<input type='text' id='monto' class='calc_input_monto' name='monto' maxlength='16' placeholder='Monto de la venta'><div id='error_monto'></div>");
        $("#calc_panel").append("<p class='calc_subtit'>El cálculo de la comisión puede variar en los centavos por cuestiones de redondeo.</p>");
        $("#calc_boton").text("Siguiente");
        $("#monto").on('keyup', function (event) {
            let max = parseInt(999999999999);
            let min = 1;
            let valor = this.value;
            valor = moneda_to_num(valor);
            if (valor > max) {
                this.value = max;
                deshabilita_boton()
            }
            else if (valor < min) {
                deshabilita_boton()
            }
            else {
                habilita_boton()
            }
            validacion_monto();
        });
        $("#calc_boton").attr('data-reiniciar', '0');
        $("#calc_boton").attr("data-calcular", '0');
        incluye_decimales = 0;
        validacion_monto();
        //mascara de entrada al monto
        $("#monto").on({
            "focus": function (event) {
                $(".placeholder_monto").show();
                $(event.target).attr("placeholder", "")
                $(event.target).select();
            },
            "focusout": function (event) {
                if (!$(event.target).val().length) {
                    $(".placeholder_monto").hide();
                    $(event.target).attr("placeholder", "Monto de la venta");
                }
            },
            "keyup": function (event) {
                if ($(event.target).val().length) {
                    $(event.target).val(function (index, value) {
                        monto_valido = valida_monto(value);
                        if (value.length == 1 && value == "0") {
                            return "";
                        }
                        if (monto_valido) {
                            value = moneda_to_num(value)
                            char = value.charAt(value.length - 1)
                            if (char == ".") {
                                return "$" + formato_miles_entero(value) + ".";
                            }
                            if (entero(value)) {
                                return "$" + formato_miles_entero(value);
                            }
                            else {
                                return "$" + formato_miles_entero(parte_entera(value)) + "." + decimales(value);
                            }
                        }
                        else {
                            return "";
                        }
                    });
                }
            }

        });//fin on

        //clic en las opciones de arriba
        $(".opt_reg_mes").click(function () {
            if (!$(this).hasClass('activo')) {
                $(".opt_reg_mes").removeClass("activo");
                $(this).addClass("activo");
                if ($(this).attr("id") == "opt_regular") { $("#calc_boton").attr('data-meses', '0'); }
            }
            if ($("#monto").length) {
                validacion_monto();
            }
            else {
                inicial($(this).attr('id'));
            }
        });
        /* las siguientes lineas permiten activar el boton pulsando enter, se coloca en este espacio para que funcione cada vez que se recarga la pagina */
        document.querySelector("#monto").addEventListener("keyup", event => {
            if (event.key !== "Enter") return; // Use `.key` instead.
            document.querySelector("#calc_boton").click(); // Things you want to do.
            event.preventDefault(); // No need to `return false;`.
        });



    }

    function habilita_boton() { //pinta el boton para que pueda funcionar
        $("#calc_boton").addClass("activo");
    }
    function deshabilita_boton() { //pinta el color para desactuvar el boton
        $("#calc_boton").removeClass("activo");
    }

    function validacion_monto() {
        deshabilita_boton();
        valor = $("#monto").val();
        valor = moneda_to_num(valor);
        $("#error_monto").text("");
        $("#error_monto").hide();
        if (valor > 0) {
            habilita_boton();
        }
        else {
            deshabilita_boton();
        }
    }

    function boton_activo() {
        return $("#calc_boton").hasClass("activo");
    }
    function boton_es_reiniciar() {
        return parseInt($("#calc_boton").attr('data-reiniciar'));
    }
    function moneda(num, dec = 2) {
        formateado = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: dec });
        return formateado;
    }
    function moneda_to_num(mon) { //da formato al texto para convertirlo en un numero operable
        mon = mon.replace(/,/g, "");
        mon = mon.replace(/\$/, "");
        return mon;
    }

    function formato_miles_entero(num) {
        return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    }
    function valida_monto(n) {
        n = moneda_to_num(n);
        return ((Number(n) == n && n % 1 === 0) || (Number(n) == n && n % 1 !== 0));
    }
    function entero(n) {
        return (Number(n) == n && n % 1 === 0)
    }

    function parte_entera(value) {
        return Math.trunc(value).toString();
    }

    function decimales(value) {
        pos = value.toString().indexOf(".");
        return value.toString().substring(pos + 1, pos + 4);
    }

    function calculaComisionFix(valor) {
        comisionInicial = calculaComisionTotal(valor);
        verifica = calculaSinComision(comisionInicial);
        diferencia = valor - verifica
        total = redondeoUp(comisionInicial + diferencia);
        return total;
    }

    function calculaComisionTotal(valor) {
        comision = valor * porcentaje_de_comision / 100;
        iva = comision * porcentaje_de_iva / 100;
        total = valor + comision + iva
        return total
    }

    function calculaSinComision(valor) {
        comision = valor * porcentaje_de_comision / 100;
        iva = comision * porcentaje_de_iva / 100;
        total = valor - comision - iva
        return total
    }

    function redondeoUp(redondeo) {
        redondeo = Math.ceil(redondeo)
        return redondeo
    }

});