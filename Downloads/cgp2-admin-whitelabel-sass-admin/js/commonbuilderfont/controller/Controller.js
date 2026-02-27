Ext.define("CGP.commonbuilderfont.controller.Controller", {


    optionWindow: null,//属性的选项管理window（显示）
    addOptionWindow: null,//添加一个选项的添加window（添加）

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },
    deleteRecords: function (recordIds, grid) {
        Ext.Ajax.request({
            url: adminPath + 'api/commonbuilderfont/deleteFonts?ids=' + recordIds.join(','),
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                        grid.store.load();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
    },
    addRecords: function (recordIds, grid, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/commonbuilderfont/addFonts?ids=' + recordIds.join(','),
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        win.close();
                        grid.store.load();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
    },
    checkDefaultFont: function (page) {
        var me = this;
        var mask = page.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/commonbuilderfont/defaultFont',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    mask.hide();
                    var data = responseMessage.data;
                    Ext.create('Ext.window.Window', {
                        title: i18n.getKey('check') + i18n.getKey('default') + i18n.getKey('font'),
                        width: 450,
                        modal: true,
                        layout: 'fit',
                        items: [{
                            xtype: 'form',
                            border: false,
                            padding: 20,
                            fieldDefaults: {
                                readOnly: true,
                                width: 300,
                                fieldStyle: 'background-color:silver'
                            },
                            items: [{
                                name: '_id',
                                xtype: 'textfield',
                                value: data._id,
                                fieldLabel: i18n.getKey('id'),
                                itemId: 'id'
                            }, {
                                name: 'fontFamily',
                                xtype: 'textfield',
                                regex: /^\S+.*\S+$/,
                                value: data.fontFamily,
                                regexText: '值的首尾不能存在空格！',
                                fieldLabel: i18n.getKey('fontFamily'),
                                itemId: 'fontFamily'
                            },
                                {
                                    name: 'displayName',
                                    xtype: 'textfield',
                                    value: data.displayName,
                                    fieldLabel: i18n.getKey('displayName'),
                                    itemId: 'displayName'
                                },
                                {
                                    name: 'wordRegExp',
                                    xtype: 'textfield',
                                    value: data.wordRegExp,
                                    fieldLabel: i18n.getKey('wordRegExp'),
                                    itemId: 'wordRegExp'
                                }
                            ]
                        }],
                        bbar: ['->', {
                            text: i18n.getKey('modify'),
                            iconCls: 'icon_edit',
                            handler: function () {
                                var win = this.ownerCt.ownerCt;
                                me.setDefaultFont(page,win);
                            }
                        }, {
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function () {
                                var win = this.ownerCt.ownerCt;
                                win.close();
                            }
                        }]


                    }).show();
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })

    },
    setDefaultFont: function (page,checkWin) {
        var me = this;
        var builderFontStore = Ext.create('CGP.commonbuilderfont.store.BuilderFont');
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('modify') + i18n.getKey('default') + i18n.getKey('font'),
            width: 450,
            modal: true,
            layout: 'fit',
            items: [{
                xtype: 'form',
                border: false,
                padding: 20,
                itemId: 'defaultFontForm',
                fieldDefaults: {
                    width: 300
                },
                items: [{
                    name: 'defaultFont',
                    xtype: 'gridcombo',
                    itemId: 'defaultFont',
                    fieldLabel: i18n.getKey('default') + i18n.getKey('font'),
                    multiSelect: false,
                    displayField: 'fontFamily',
                    valueField: '_id',
                    labelAlign: 'right',
                    store: builderFontStore,
                    queryMode: 'remote',
                    editable: false,
                    matchFieldWidth: false,
                    pickerAlign: 'bl',
                    gridCfg: {
                        store: builderFontStore,
                        height: 280,
                        width: 550,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: '_id'
                            },
                            {
                                text: i18n.getKey('fontFamily'),
                                width: 200,
                                dataIndex: 'fontFamily'
                            },
                            {
                                text: i18n.getKey('displayName'),
                                width: 200,
                                dataIndex: 'displayName'
                            }
                        ],
                        tbar: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                width: 170,
                                isLike: false,
                                padding: 2
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: '_id',
                                    hideTrigger: true,
                                    isLike: false,
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('fontFamily'),
                                    name: 'fontFamily',
                                    labelWidth: 40
                                },
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    handler: me.searchFont,
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    handler: me.clearParams,
                                    width: 80
                                }
                            ]
                        },
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: builderFontStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                }
                ]
            }],
            bbar: ['->', {
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function () {
                    var selectWin =this.ownerCt.ownerCt;
                    var targetFontId  = selectWin.getComponent('defaultFontForm').getComponent('defaultFont').getSubmitValue();

                    me.modifyDefaultFont(page,checkWin,targetFontId,selectWin);
                }
            }, {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    win.close();
                }
            }]


        }).show();

    },

    searchFont: function () {
        var queries = [];
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            if (Ext.isNumber(query.value)) {
                query.type = 'number';
            } else {
                query.type = 'string';
            }
            queries.push(query);
        }
        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }

        store.loadPage(1);
    },
    clearParams: function () {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;
    },
    modifyDefaultFont: function (page,checkWin,targetFontId,selectWin) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/commonbuilderfont/setDefaultFont/'+targetFontId,
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        checkWin.close();
                        selectWin.close();
                        me.checkDefaultFont(page);
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
    }

});
