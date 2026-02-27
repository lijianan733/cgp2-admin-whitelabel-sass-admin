/**
 *产品编辑页面 媒体模块的图片组件
 */
Ext.define('CGP.product.edit.component.image.Image', {

    extend: 'Ext.panel.Panel',

    requires: ['CGP.product.edit.component.image.ImageGroup', 'CGP.product.edit.component.image.Upload'],


    config: {
        type: 'PRODUCT_IMAGE',
        autoScroll: true
    },

    constructor: function (config) {

        var me = this;


        config = config || {};

        Ext.apply(config, me.config);
        me.initConfig(config);
        config.layout = 'vbox';
        config.title = i18n.getKey('image');

        me.callParent([config]);
        me.group = Ext.create('CGP.product.edit.component.image.ImageGroup');
        me.upload = Ext.create('CGP.product.edit.component.image.Upload');

        me.add(me.upload, me.group);

        me.group.relayEvents(me.upload, ['afterimageupload']);

        me.group.on('afterimageupload', me.group.afterUploadImage, me.group);

        me.content = me;

    },

    setValue: function (data) {
        var me = this;
        me.group.setValue(data);
    },
    getValue: function () {
        var me = this;
        return me.group.getValue();
    },

    copy: function () {
        var me = this;
        me.group.copy();
    }

})