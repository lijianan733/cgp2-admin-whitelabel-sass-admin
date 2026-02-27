/**
 *
 */
Ext.define('CGP.materialviewtype.view.TreeField', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.treefield',

    require: [
        'Ext.tree.Panel'
    ],

    treePanel: null,

    selType: 'rowmodel',
    valueType : null,
    height: 300,

    _contentId: null,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me._contentId = 'treefield-content-id';
        var width = (500);
        var height = (300) + 50;
        var value = '<div id="' + me._contentId + '" ></div>';
        me.setValue(value);
        me.on("disable",function(display){
            display.getPanel().setDisabled( true);
        });
        me.on("enable",function(display){
            display.getPanel().setDisabled(false);
        });
    },
    getJsonObjectValue:function (){
        var me = this;
        return me._treePanel.getJsonObjectValue();
    },
    getSubmitValue: function () {
        var me = this;
        var value = [];
        return me._treePanel.getValue();
    },

    //这个方法是form.form.getValues()调用的。用于表单提交（$(options.form).ajaxSubmit（））。
    getSubmitData: function(){
        var me = this,value = {};
        value[me.name] = me.getSubmitValue();
        return value;
    },
    setSubmitValue: function (value,notLoad) {
        var me = this;
        if (!Ext.isEmpty(value)) {
            me._treePanel.refreshData(value,notLoad);
        }
    },
    getPanel: function () {
        return this._treePanel;
    },
    getStore: function () {
        return this._treePanel.getStore();
    },
    onRender: function () {
        this.callParent(arguments);

        this.initPanel();
    },

    initPanel: function () {
        var me = this;
        /*me.gridConfig = Ext.merge(me.gridConfig, {
            renderTo: document.getElementById(me._contentId),
            height:400,
            autoScroll:true

        });*/
        me._treePanel = Ext.create('CGP.materialviewtype.view.RtObjectTree',{
            renderTo: document.getElementById(me._contentId),
            header: false,
            readOnly:me.isSetValue
        });
    },

    reset: function () {
        this._treePanel.getStore().removeAll();
    }
});