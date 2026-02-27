/**
 * Created by nan on 2020/10/29
 */
Ext.define('CGP.color.controller.Controller', {
    getColor: function (data) {
        var colorClazz = data.clazz;
        if (colorClazz == 'com.qpp.cgp.domain.common.color.RgbColor') {
            var color = '#' + JSGetHEx(data['r']) + JSGetHEx(data['g']) + JSGetHEx(data['b']) + '';
            color = color.toLocaleUpperCase();
            color = ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
            return color;
        } else if (colorClazz == 'com.qpp.cgp.domain.common.color.CmykColor') {
            var RGBColor = data['displayColor'];
            var color = '#' + JSGetHEx(RGBColor['r']) + JSGetHEx(RGBColor['g']) + JSGetHEx(RGBColor['b']) + '';
            color = color.toLocaleUpperCase();
            color = ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
            return color;

        } else if (colorClazz == 'com.qpp.cgp.domain.common.color.SpotColor') {
            var RGBColor = data['displayColor'];
            var color = '#' + JSGetHEx(RGBColor['r']) + JSGetHEx(RGBColor['g']) + JSGetHEx(RGBColor['b']) + '';
            color = color.toLocaleUpperCase();
            color = ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
            return color;
        }
    }
})
