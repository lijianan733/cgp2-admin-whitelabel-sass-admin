/**
 *
 */
Ext.syncRequire(['CGP.test.TestCusTree']);
Ext.define('CGP.test.TreeField', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.treefield',

    require: [
        'Ext.tree.Panel'
    ],

    _grid: null,

    selType: 'rowmodel',
    valueType : null,
    height: 300,

    _contentId: null,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        /*if (!me.gridConfig) {
            throw new Error('gridConfig can not be null!');
        }*/
        //var gridConfig = me.gridConfig;
        me._contentId = /*me.gridConfig.renderTo || */'treefield-content-id';
        var width = (500);
        var height = (300) + 50;
        var value = '<div id="' + me._contentId + '" ></div>';
        me.setValue(value);
        me.on("disable",function(display){
            display.getGrid().setDisabled( true);
        });
        me.on("enable",function(display){
            display.getGrid().setDisabled(false);
        });
    },

    getSubmitValue: function () {
        var me = this;
        var value = [];
        me._grid.getStore().each(function (record) {
            if(me.valueType == "id"){
                value.push(record.get("id"));
            }else{
                value.push(record.data);
            }
        });

        return value;
    },

    //这个方法是form.form.getValues()调用的。用于表单提交（$(options.form).ajaxSubmit（））。
    getSubmitData: function(){
        var me = this,value = {};
        value[me.name] = me.getSubmitValue();
        return value;
    },
    setSubmitValue: function (value) {
        var me = this;
        if (Ext.isArray(value)) {
            me._grid.getStore().loadData(value);
        }
    },
    getGrid: function () {
        return this._grid;
    },
    getStore: function () {
        return this._grid.getStore();
    },
    onRender: function () {
        this.callParent(arguments);

        this.initGrid();
    },

    initGrid: function () {
        var me = this;
        /*me.gridConfig = Ext.merge(me.gridConfig, {
            renderTo: document.getElementById(me._contentId),
            height:400,
            autoScroll:true

        });*/
        me._grid = Ext.create('CGP.test.TestCusTree',{
            renderTo: document.getElementById(me._contentId),
            header: false
        });
    },

    reset: function () {
        this._grid.getStore().removeAll();
    }
});