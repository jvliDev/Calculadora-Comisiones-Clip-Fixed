/* JvliDev */
/* Codigo Extraido de "https://www.clip.mx/como-funciona-clip/calculadora-clip"; creditos a su autor */
document.addEventListener("DOMContentLoaded", function () {


    $(document).ready(function () {
        inicial();
        $("#calc_boton").click(function () {
            if (boton_activo() && boton_es_reiniciar()) {
                $("#calc_boton").attr('data-reiniciar', '0');
                $("#calc_boton").removeClass('activo');
                if ($("#calc_boton").attr("data-meses") == 1) {
                    inicial("opt_meses");
                }
                else {
                    inicial();
                }
            }
            else if (boton_activo() && !boton_es_reiniciar()) {
                if ($("#opt_regular").hasClass('activo')) {
                    calculo_regular();
                }
                else {
                    if ($("#opt_meses").hasClass('activo') && $("#calc_boton").attr("data-calcular") == 0) {
                        $("#monto_h").val($("#monto").val());
                        muestra_opciones_meses();
                    }
                    else if ($("#opt_meses").hasClass('activo') && $("#calc_boton").attr("data-calcular") == 1) {
                        muestra_calculo_meses();
                    }
                }
            }
        });
    });//fin ready
    function obtiene_mes_seleccionado() {
        $(".opciones_meses p").each(function (index) {
            if ($(this).hasClass("activo")) {
                return $(this).text();
            }
        });
    }
    function set_clic_meses(recalculo = 0, meses = 0, monto = 0) {
        $(".opciones_meses p").click(function () {
            $(".opciones_meses p").removeClass("activo");
            $(this).addClass("activo");
            $("#meses_h").val($(this).text());
            if (recalculo) {
                calcula_cuotas($("#meses_h").val(), monto);
            }
        });
    }
    function muestra_calculo_meses() {
        meses = [3, 6, 9, 12, 18, 24]
        monto_num = moneda_to_num($("#monto_h").val());
        monto_f = moneda(monto_num * 1, 3);
        $("#calc_panel").html("<p class='calc_titulo_panel'>Para una venta de $" + monto_f + " recibes</p>");
        $("#calc_panel").append("<p class='calc_subtitulo1' style='margin-bottom:10px;'>Cantidad de meses a ofrecer</p>");
        mes_h = $("#meses_h").val();
        salida = "<div class='opciones_meses reducido'>";
        meses.forEach(function (mes) {
            if (mes_h == mes) {
                salida = salida + "<p class='activo'>" + mes + "</p>";
            }
            else {
                salida = salida + "<p>" + mes + "</p>";
            }
        });
        salida = salida + "</div>";
        $("#calc_panel").append(salida);
        $("#calc_panel").append("<div id='datos_comisiones'></div>");
        calcula_cuotas(mes_h, $("#monto_h").val());
        set_clic_meses(1, mes_h, $("#monto_h").val());
        $("#calc_boton").text("Calcular otra cantidad");
        $("#calc_boton").attr('data-reiniciar', '1');
        $("#calc_boton").attr('data-meses', '1');
    }
    function calcula_cuotas(meses, monto_f) {
        monto = moneda_to_num(monto_f);
        porcentaje_de_comision = 3.6;
        iva = 16;
        //const installentsCommission = {3: 4.5, 6: 7.5, 9: 9.9, 12: 11.95, 18: 17.70, 24: 22.30};
        const installentsCommission = { 3: 4.57, 6: 7.57, 9: 11.07, 12: 12.77, 18: 19.27, 24: 27.17 };
        comision_transaccion = monto * porcentaje_de_comision / 100;
        comision_meses_sin_intereses = installentsCommission[meses] * monto / 100;
        iva_de_la_comision = (comision_transaccion + comision_meses_sin_intereses) * iva / 100;
        cliente_recibe = monto - (comision_transaccion + comision_meses_sin_intereses + iva_de_la_comision);
        cliente_recibe = moneda(cliente_recibe);
        comision_transaccion = moneda(comision_transaccion)
        comision_meses_sin_intereses = moneda(comision_meses_sin_intereses);
        iva_de_la_comision = moneda(iva_de_la_comision);
        $("#datos_comisiones").html("<p class='calc_titulo_monto'>$" + cliente_recibe + "</p>");
        $("#datos_comisiones").append("<div class='calc_fila meses uno'><p class='uno'>" + porcentaje_de_comision + "%</p><p class='dos'>Comisión por transacción</p><p class='tres'>$" + comision_transaccion + "</p></div");
        $("#datos_comisiones").append("<div class='calc_fila meses uno'><p class='uno'>" + installentsCommission[meses] + "%</p><p class='dos'>Comisión meses sin intereses</p><p class='tres'>$" + comision_meses_sin_intereses + "</p></div");
        $("#datos_comisiones").append("<div class='calc_fila meses dos'><p class='uno'>" + iva + "%</p><p class='dos'>IVA de la comisión</p><p class='tres'>$" + iva_de_la_comision + "</p></div");
    }
    function muestra_opciones_meses() {
        $("#calc_panel").html("<p class='calc_titulo_panel'>Cantidad de meses a ofrecer</p>");
        $("#calc_panel").append("<div class='opciones_meses'><p class='activo'>3</p><p>6</p><p>9</p><p>12</p><p>18</p><p>24</p></div>");
        $("#calc_panel").append("<p class='calc_subtitulo1'>El cálculo de la comisión puede variar en los centavos por cuestiones de redondeo.</p>");
        $("#meses_h").val(3);
        $("#calc_boton").text("Calcular");
        $("#calc_boton").attr("data-calcular", "1");
        set_clic_meses();
    }
    function calculo_regular() {
        porcentaje_de_comision = 3.6;
        porcentaje_de_iva = 16;
        monto = $("#monto").val();
        valor = moneda_to_num(monto);
        valor = valor * 1;
        monto_f = moneda(valor, 3);
        comision = valor * porcentaje_de_comision / 100;
        iva = comision * porcentaje_de_iva / 100;
        customer_recibe = valor - comision - iva;
        $("#calc_panel").html("<p class='calc_titulo_panel'>Para una venta de $" + monto_f + " recibes</p>");
        customer_recibe_f = moneda(customer_recibe);
        $("#calc_panel").append("<p class='calc_titulo_monto'>$" + customer_recibe_f + "</p>");
        comision_f = moneda(comision);
        $("#calc_panel").append("<div class='calc_fila uno'><p class='uno'>" + porcentaje_de_comision + "%</p><p class='dos'>Comisión por transacción</p><p class='tres'>$" + comision_f + "</p></div");
        iva_f = moneda(iva);
        $("#calc_panel").append("<div class='calc_fila dos'><p class='uno'>" + porcentaje_de_iva + "%</p><p class='dos'>IVA de la comisión</p><p class='tres'>$" + iva_f + "</p></div");
        $("#calc_boton").text("Calcular otra cantidad");
        $("#calc_boton").attr('data-reiniciar', '1');
    }
    function inicial(opt_id = "opt_regular") {
        //$("#calc_panel").html("<p class='calc_titulo_panel'>Ingresa el monto de la venta</p>");
        $("#calc_panel").html("<p class='calc_titulo_panel'></p>");
        $("#calc_panel").append("<div class='placeholder_monto'>Monto de la venta</div><input type='text' id='monto' class='calc_input_monto' name='monto' maxlength='16' placeholder='Monto de la venta'><div id='error_monto'></div>");
        $("#calc_panel").append("/<p class='calc_subtitulo1'>El cálculo de la comisión puede variar en los centavos por cuestiones de redondeo.</p>");
        $("#calc_boton").text("Siguiente");
        $("#" + opt_id).addClass('activo');
        if (opt_id == "opt_regular") {
            $("#calc_boton").attr('data-meses', '0');
        }
        //valida numero minimo y maximo
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
        });//fin on
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
    }//fin inicial
    function habilita_boton() {
        $("#calc_boton").addClass("activo");
    }
    function deshabilita_boton() {
        $("#calc_boton").removeClass("activo");
    }
    function validacion_monto() {
        deshabilita_boton();
        valor = $("#monto").val();
        valor = moneda_to_num(valor);
        if ($("#opt_meses").hasClass('activo')) {
            if (valor < 300 && valor > 0) {
                $("#error_monto").text("El monto mínimo para ofrecer meses sin intereses es de $300");
                $("#error_monto").show();
                deshabilita_boton();
            }
            else if (valor >= 300) {
                $("#error_monto").text("");
                $("#error_monto").hide();
                habilita_boton();
            }
        }
        else {
            $("#error_monto").text("");
            $("#error_monto").hide();
            if (valor > 0) {
                habilita_boton();
            }
            else {
                deshabilita_boton();
            }
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
    function moneda_to_num(mon) {
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

});
