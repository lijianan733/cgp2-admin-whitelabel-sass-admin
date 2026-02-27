/**
 *product media
 */
Ext.define('CGP.product.edit.module.Media', {
    extend: 'Ext.tab.Panel',

    requires: ['CGP.product.edit.component.image.Image'],

    config: {
        style: 'margin:5px'
    },



    constructor: function (config) {

        var me = this;




        config = config || {};

        config = Ext.apply(config, {
            title: i18n.getKey('media')
        })

        config = Ext.apply(me.config, config);


        me.initConfig(config);

        me.callParent([config]);

        me.imagePanel = Ext.create('CGP.product.edit.component.image.Image');

        me.add(me.imagePanel);

        me.content = me;
    },
    setValue: function (data) {
        this.imagePanel.setValue(data);
    },

    getValue: function () {
        return this.imagePanel.getValue();
    },

    copy: function () {
        this.imagePanel.copy();
    }


})