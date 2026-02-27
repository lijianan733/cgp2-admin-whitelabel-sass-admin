Ext.define('CGP.product.edit.module.Template', {
    extend: 'Ext.ux.form.Panel',
    hidden: true,

    constructor: function (config) {
        var me = this;


        var config = config || {};

        var applyConfig = {
            title: i18n.getKey('template'),
            columnCount: 1,
            model: 'CGP.model.ProductTemplate',
            items: [{
                name: 'pageTitle',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('pageTitle'),
                itemId: 'pageTitle'
            }, {
                name: 'pageKeywords',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('pageKeyWords'),
                itemId: 'pageKeywords'
            }, {
                name: 'pageDescription',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('pageDescription'),
                itemId: 'pageDescription'
            }, {
                name: 'pageUrl',
                xtype: 'textfield',
                stripCharsRe: /([^a-z0-9-\s])/,
                regex: /^([a-z0-9]|[-\s])+$/,
                regexText: '只允许输入小写字母,数字,字符’-‘和空格',
                fieldLabel: i18n.getKey('pageUrl'),
                itemId: 'pageUrl'
            }]
        };

        config = Ext.apply(applyConfig, config);
        me.callParent([config]);
        me.content = me;
    },

    setValue: function (data) {
        var me = this;
        me.form.setValuesByModel(new CGP.model.ProductTemplate(data));
    }


})