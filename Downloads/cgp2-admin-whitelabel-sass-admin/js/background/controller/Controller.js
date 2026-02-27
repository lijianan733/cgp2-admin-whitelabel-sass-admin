/**
 * Created by nan on 2020/12/18
 */
Ext.define('CGP.background.controller.Controller', {
    /**
     * 新建一新的背景
     * @param data
     * @param form
     */
    builderNewBackground: function (data, form) {
        var url = adminPath + 'api/backgrounds/batchGenerate';
        console.log(data)
        JSAjaxRequest(url, 'POST', false, data, i18n.getKey('addsuccessful'), function (require, success, response) {
            form.el.unmask();
            if (success == true) {
                var responseText=Ext.JSON.decode(response.responseText);
                if(responseText.success==true){
                    form.ownerCt.gridPanel.store.load();
                    form.ownerCt.close();
                }
            }
        })
    },
    /**
     * 编辑分类的接口
     * @param data
     * @param grid
     */
    editSeriesWindow: function (data, grid) {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey('category'),
            items: [
                {
                    xtype: 'form',
                    defaults: {
                        margin: 10
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'name',
                            allowBlank: false,
                            value: data ? data.name : '',
                            fieldLabel: i18n.getKey('name')
                        },
                        {
                            xtype: 'textfield',
                            name: 'displayName',
                            allowBlank: false,
                            value: data ? data.displayName : '',
                            fieldLabel: i18n.getKey('displayName')
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'clazz',
                            allowBlank: true,
                            value: 'com.qpp.cgp.domain.background.BackgroundSeries'
                        },
                        {
                            xtype: 'textfield',
                            name: '_id',
                            hidden: true,
                            allowBlank: true,
                            value: data ? data._id : '',
                            fieldLabel: i18n.getKey('_id')
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    iconCls: 'icon_agree',
                    text: i18n.getKey('confirm'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.items.items[0];
                        if (form.isValid()) {
                            var data = form.getValues();
                            controller.saveSeriesConfig(data, grid);
                            win.close();
                        }
                    }
                }
            ]
        });
        win.show();
    },
    /**
     * 保存分类配置
     */
    saveSeriesConfig: function (data, grid) {
        var method = 'POST';
        var url = adminPath + 'api/backgroundSeries';
        var message = i18n.getKey('addsuccessful')
        if (data._id) {
            method = 'PUT';
            url += '/' + data._id;
            message = 'modifySuccess';
        }
        JSAjaxRequest(url, method, false, data, message, function (require, success, response) {
            grid.store.load();
        });
    },
    /**
     * 删除分类
     */
    deleteSeriesConfig: function (id, grid) {
        var method = 'DELETE';
        var url = adminPath + 'api/backgroundSeries/' + id;
        var message = i18n.getKey('deleteSuccess')
        JSAjaxRequest(url, method, false, null, message, function (require, success, response) {
            grid.store.load();
        });
    },
    /**
     *添加一个指定的尺寸的弹窗
     */
    showAddNewBackgroundSizeWin: function (manageSizeWin, backgroundId) {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey('添加指定尺寸'),
            items: [

                {
                    xtype: 'form',
                    defaults: {
                        width:350,
                        margin: '10 25 10 25',
                        allowBlank: false,
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'name',
                            itemId: 'name',
                            fieldLabel: i18n.getKey('尺寸描述')
                        }, {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            name: 'productWidth',
                            itemId: 'productWidth',
                            fieldLabel: i18n.getKey('产出物宽度')
                        }, {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            minValue: 0,
                            name: 'productHeight',
                            itemId: 'productHeight',
                            fieldLabel: i18n.getKey('产出物高度')
                        },
                        {
                            xtype: 'uxfieldcontainer',
                            fieldLabel: i18n.getKey('出血线位置'),
                            name: 'cut',
                            labelAlign: 'left',
                            itemId: 'cut',
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            defaults: {
                                width: 120,
                                labelWidth: 30,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    hideTrigger: true,
                                    minValue: 0,
                                    name: 'cutTop',
                                    itemId: 'cutTop',
                                    allowBlank: true,
                                    value:0,
                                    fieldLabel: i18n.getKey('up')
                                }, {
                                    xtype: 'numberfield',
                                    hideTrigger: true,
                                    minValue: 0,
                                    name: 'cutBottom',
                                    itemId: 'cutBottom',
                                    allowBlank: true,
                                    value:0,
                                    fieldLabel: i18n.getKey('down')
                                }, {
                                    xtype: 'numberfield',
                                    hideTrigger: true,
                                    minValue: 0,
                                    name: 'cutLeft',
                                    itemId: 'cutLeft',
                                    allowBlank: true,
                                    value:0,
                                    fieldLabel: i18n.getKey('left')
                                }, {
                                    xtype: 'numberfield',
                                    hideTrigger: true,
                                    name: 'cutRight',
                                    itemId: 'cutRight',
                                    allowBlank: true,
                                    value:0,
                                    fieldLabel: i18n.getKey('right')
                                }
                            ]
                        },
                        {
                            xtype: 'combo',
                            name: 'unit',
                            fieldLabel: i18n.getKey('unit'),
                            itemId: 'unit',
                            value: 'mm',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [

                                    {
                                        value: 'cm',
                                        display: i18n.getKey('cm')
                                    },
                                    {
                                        value: 'mm',
                                        display: i18n.getKey('mm')
                                    },
                                    {
                                        value: 'in',
                                        display: i18n.getKey('in')
                                    }
                                ]
                            }),
                            editable: false,
                            valueField: 'value',
                            displayField: 'display'
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    iconCls: 'icon_agree',
                    text: i18n.getKey('confirm'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.items.items[0];
                        if (form.isValid()) {
                            var data = form.getValues();
                            data = {
                                sizes: [
                                    data
                                ],
                                "clazz": "com.qpp.cgp.domain.background.BackgroundGenerateConfig"
                            }
                            controller.addNewBackgroundSize(data, backgroundId, manageSizeWin, win);
                        }
                    }
                }
            ]
        });
        win.show();
    },
    /**
     * 添加一个尺寸
     * @param data
     */
    addNewBackgroundSize: function (data, backgroundId, manageSizeWin, addSizeWin) {
        var controller = this;
        var url = adminPath + 'api/backgrounds/' + backgroundId + '/images';
        addSizeWin.el.mask('loading...');
        setTimeout(function () {
            JSAjaxRequest(url, 'POST', false, data, i18n.getKey('addsuccessful'), function (require, success, response) {
                addSizeWin.el.unmask();
                addSizeWin.close();
                if (success == true) {
                    manageSizeWin.refreshData();
                }
            })
        }, 100)


    },
    /**
     * 删除一个背景尺寸
     */
    deleteBackgroundSize: function (imageDataId, container, item) {
        var me = this;
        var url = adminPath + 'api/backgroundImages/' + imageDataId;
        JSAjaxRequest(url, 'DELETE', false, null, i18n.getKey('deleteSuccess'), function (require, success, response) {
            if (success == true) {
                container.remove(item);
            }
        })
    }
})