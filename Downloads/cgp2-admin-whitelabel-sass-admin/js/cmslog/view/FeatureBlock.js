/**
 * @Description:功能块
 * 分为两大部分，头部的工具栏和中间的具体功能区
 * @author nan
 * @date 2022/2/18
 */
Ext.Loader.syncRequire([])
Ext.define('CGP.cmslog.view.FeatureBlock', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.featureblock',
    layout: {
        type: 'vbox',
    },
    defaults: {
        margin: '10 25 10 25',
    },
    bodyStyle: {
        borderColor: 'silver'
    },
    title: null,
    border: false,
    controller: null,
    toolbarActionBtn: null,//[]工具栏里面需要自定义的按钮数组
    componentArr: null,//功能列表的组件
    constructor: function (config) {
        var me = this;
        me.componentArr = [];
        me.toolbarActionBtn = [];
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.header = false;
        me.controller = Ext.create('CGP.cmslog.controller.Controller');
        me.tbar = {
            xtype: 'toolbar',
            width: '100%',
            color: 'black',
            itemId: 'tbar',
            bodyStyle: {
                borderColor: 'white'
            },
            border: '0 0 1 0',
            margin: '0 0 5 0',
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: false,
                    itemId: 'title',
                    value: "<font style= ' color:green;font-weight: bold'>" + me.title + '</font>'
                },
                ...me.toolbarActionBtn//...展开操作符,
            ]
        };
        me.items = [
            ...me.componentArr
        ];
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid && item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        isValid ? null : me.expand();
        return isValid;
    },
    getErrors: function () {
        return '该配置必须完备';
    },
    getFieldLabel: function () {
        return this.title;
    },
    getValue: function () {
        var me = this;
        var result = {};
        me.items.items.forEach(function (item) {
            if (item.diyGetValue && item.disabled != true) {
                result[item.getName()] = item.diyGetValue();
            } else if (item.getValue && item.disabled != true) {
                result[item.getName()] = item.getValue();
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.suspendLayouts();
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        }
        me.resumeLayouts();
        me.doLayout();
    },
    getName: function () {
        var me = this;
        return me.name;
    }
})
