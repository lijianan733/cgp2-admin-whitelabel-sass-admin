/**
 * Created by nan on 2020/11/9
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.LocalColorStore', {
    extend: 'Ext.data.Store',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'colorName',
        type: 'string'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'displayColor',
        type: 'object'
    }, {
        name: 'c',
        type: 'number'
    }, {
        name: 'm',
        type: 'number'
    }, {
        name: 'y',
        type: 'number'
    }, {
        name: 'k',
        type: 'number'
    }, {
        name: 'displayCode',
        type: 'string'
    }, {
        name: 'r',
        type: 'number'
    }, {
        name: 'g',
        type: 'number'
    }, {
        name: 'b',
        type: 'number'
    }, {
        name: 'color',
        type: 'string',
        convert: function (value, record) {
            var value = record.get('clazz');
            var color = '';
            if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                var color = '#' + JSGetHEx(record.get('r')) + JSGetHEx(record.get('g')) + JSGetHEx(record.get('b')) + '';
                color = color.toLocaleUpperCase();
                color = ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
                return color;
            } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                var RGBColor = record.get('displayColor');
                var color = '#' + JSGetHEx(RGBColor['r']) + JSGetHEx(RGBColor['g']) + JSGetHEx(RGBColor['b']) + '';
                color = color.toLocaleUpperCase();
                color = ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
                return color;

            } else if (value == 'com.qpp.cgp.domain.common.color.SpotColor') {
                var RGBColor = record.get('displayColor');
                var color = '#' + JSGetHEx(RGBColor['r']) + JSGetHEx(RGBColor['g']) + JSGetHEx(RGBColor['b']) + '';
                color = color.toLocaleUpperCase();
                color = ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
                return color;
            }
        }
    }],
    proxy: {
        type: 'pagingmemory'
    }
});