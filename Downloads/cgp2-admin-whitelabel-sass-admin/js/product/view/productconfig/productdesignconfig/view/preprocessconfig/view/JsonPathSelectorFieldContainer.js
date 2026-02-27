/**
 * Created by nan on 2021/1/19
 * 配置一layer数据源，用于创建jsonPath,
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.JsonPathSelectorFieldContainer', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.jsonpathselectorfieldcontainer',
    layout: 'hbox',
    labelAlign: 'left',
    defaults: {},
    allowBlank: false,
    isValid: function () {
        var me = this;
        if (me.allowBlank == true) {
            return true;
        } else {
            return me.getComponent('componentPath').isValid();
        }
    },
    setValue: function (data) {
        var me = this;
        if (data) {
            me.getComponent('componentPath').setValue(data);
        }
    },
    getValue: function () {
        var me = this;
        var path = me.getComponent('componentPath').getValue();
        return path;
    },
    getLayerData: function () {
        var result = null;
        var mvtSourceDataGridField = Ext.getCmp('targetMaterialViewType');
        var mvtData = mvtSourceDataGridField.getArrayValue();
        if (mvtData) {
            var url = adminPath + 'api/pagecontentpreprocess/' + mvtData.materialViewTypeId + '/pageContentSchema';
            JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                }
            })
        } else {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择目标MVT'));
        }
        return result;
    },
    showSelectPathWin: function (layerData) {
        var fieldContainer = this;
        var dealData = function (data) {
            if (Object.prototype.toString.call(data) === '[object Array]') {//数组
                for (var x = 0; x < data.length; x++) {
                    if (Ext.isObject(data[x]) && data[x].clazz && Ext.Array.contains(['Layer', 'Container'], data[x].clazz)) {
                        data[x].id = data[x].text;
                    }
                    dealData(data[x]);
                }
            } else if (Ext.isObject(data)) {
                if (data.clazz && Ext.isEmpty(data.id)) {
                    data.id = data.text;
                }
                for (var i in data) {
                    dealData(data[i]);
                }
            } else {

            }
        };
        dealData(layerData);
        var win = Ext.widget('showjsondatawindowv2', {
            height: 620,
            editable: false,
            showValue: true,
            isHiddenRawDateForm: true,
            rawData: {
                layers: layerData
            },
            jsonTreePanelConfig: {
                canAddNode: false,
                editable: false,
            },
            title: i18n.getKey('select') + i18n.getKey('path'),
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var node = win.jsonTreePanel.getSelectionModel().getSelection()[0];
                        var pathArr = [];
                        var buildPath = function (node, pathArr) {
                            if (node.parentNode) {
                                pathArr.push(node.get('text'));
                                buildPath(node.parentNode, pathArr);
                            } else {
                                pathArr.push('$');
                            }
                        }
                        if (!Ext.isEmpty(node)) {
                            buildPath(node, pathArr);
                            pathArr = pathArr.reverse();
                            var path = pathArr.join('.');
                            path = path.replace(/.(\d+)/g, '[$1]');
                            fieldContainer.getComponent('componentPath').setValue(path);

                        } else {
                            Ext.Msg.alert('提示', '请选择一个节点');
                        }
                        win.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]
        });
        win.show();

    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                itemId: 'componentPath',
                name: 'componentPath',
                flex: 1,
                margin: '0 5 0 0',
                editable: true,
                allowBlank: false,
                fieldLabel: false,
            },
            {
                xtype: 'button',
                text: i18n.getKey('choice'),
                width: 50,
                itemId: 'button',
                handler: function (btn) {
                    var fieldContainer = btn.ownerCt;
                    var pcs = fieldContainer.getLayerData();
                    if (pcs) {
                        fieldContainer.showSelectPathWin(pcs.layers || []);
                    }
                }
            }
        ];
        me.callParent();
    }
})


