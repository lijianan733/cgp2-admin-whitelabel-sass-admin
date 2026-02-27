/**
 * Created by nan on 2019/10/22.
 * 一个通用的父filedSet
 *
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.DiyFieldSet', {
    extend: 'Ext.form.FieldSet',
    collapsible: false,
    header: false,
    xtype: 'fieldset',
    margin: '10 50 10 50',
    defaultType: 'displayfield',
    profileStore: null,//所有能使用的profile,若没有则隐藏
    layout: 'fit',
    style: {
        borderRadius: '10px'
    },
    productId: null,
    tipText: null,//提示文本
    title: i18n.getKey('condition'),
    constructor: function (config) {
        var me = this;
        var tip = config.tipText;
        config.title = "<font size='2' style= ' color:green;font-weight: bold'>" + i18n.getKey(config.title) + '</font>'
        if (tip) {
            config.title += '<img  title="' + tip + '" style="cursor:pointer;margin:0 5px 4px 5px;vertical-align: middle;width:15px; height:15px" ' +
                'src="' + path + 'ClientLibs/extjs/resources/themes/images/shared/fam/help.png' + '"/>';

        }
        me.callParent(arguments);

    },
    isValid: function () {
        var me = this;

        return me.isValid();

    },
    getValue: function () {
        var me = this;
        var value;
        return value;
    },
    setValue: function () {
        var me = this;
    }
})
