Ext.Loader.syncRequire([
    'CGP.common.field.RtTypeSelectField'
])
Ext.define("CGP.material.view.information.RtTypeObject", {
    extend: "Ext.tree.Panel",
    width: 600,
    height: 500,
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            selectedItemCls: '',
            focusedItemCls: '',
            overItemCls: ''
        }
    },
    autoScroll: true,
    children: null,
    selModel: {
        selType: 'rowmodel',
        checkOnly: true
    },
    itemId: 'rtTypeObject',
    rootNode: 'root',//根节点的位置
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('descriptionAttr');

        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            root: {
                _id: "root"
            }
        });
        me.store.proxy.url = adminPath + 'api/rtTypes/rtAttributeDefs';
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                //console.log(node);
                if (node.isRoot()) {
                    if (item.get('valueType') == 'CustomType') {
                        me.valueJsonObject[item.get('name')] = {};
                    } else {
                        if (!Ext.isEmpty(me.objectJson)) {
                            if (!Ext.isEmpty(me.objectJson[item.get('name')])) {
                                me.valueJsonObject[item.get('name')] = me.objectJson[item.get('name')]
                            } else {
                                me.valueJsonObject[item.get('name')] = null
                            }
                        }
                    }
                } else {
                    var path = node.getPath('name');
                    var array = path.split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    if (item.get('valueType') == 'CustomType') {
                        jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = {};
                    } else {
                        if (jsonPath(me.objectJson, valuePath)) {
                            jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = jsonPath(me.objectJson, valuePath)[0][item.get('name')]
                        } else {
                            jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = null
                        }
                    }
                }
            });
            //me.getSelectionModel().selectAll();
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                //tdCls: 'vertical-middle',
                width: 200,
                dataIndex: 'name'

            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                width: 350,
                dataIndex: 'value',
                sortable: false,
                listeners: {
                    beforerender: function (comp) {
                        //console.log(comp);
                        //return false;
                    }
                },
                renderer: function (value, metadata, record, a, b, c, view) {

//                    if(record.get('value')){
//                        return false;
//                    }
                    var valueType = record.get('valueType');
                    var selectType = record.get('selectType');
                    var options = record.get('options');
                    var array = record.getPath('name').split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    var comp;
                    switch (selectType) {
                        case 'NON':
                            if (Ext.Array.contains(['String', 'Date'], valueType)) {
                                comp = {
                                    xtype: 'textfield',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    }
                                }

                            } else if (Ext.Array.contains(['Number', 'int'], valueType)) {
                                comp = {
                                    xtype: 'numberfield',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    allowBlank: false
                                }

                            } else if (valueType === 'Boolean') {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    valueField: 'value',
                                    editable: false,
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }

                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: [
                                            {name: 'true', value: true},
                                            {name: 'false', value: false}
                                        ]
                                    }),
                                    queryMode: 'local'
                                }
                            }
                            break;
                        case 'SINGLE':
                            if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    editable: false,
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: options
                                    }),
                                    queryMode: 'local'
                                }

                            }
                            break;
                        case 'MULTI':
                            if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    multiSelect: true,
                                    editable: false,
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: options
                                    }),
                                    queryMode: 'local'
                                }

                            }
                            break;
                    }

                    return comp;
                }

            }
        ];
        me.listeners = {
            afterrender: function () {
                //me.expandAll();
            },
            beforeload: function (sto, operation, e) {
                var type = operation.node.get('valueType');
                var rtTypeId;
                var customType = operation.node.get('customType');
                if (customType) {
                    rtTypeId = customType['_id'];
                }
                if (type == 'CustomType') {
                    sto.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
                } else {
                    //sto.proxy.url = adminPath + 'api/admin/runtimeType/rtTypes/{id}/rtAttributeDefs';
                }
            },
            afteritemexpand: function () {
                //me.getSelectionModel().selectAll();
            }
        };
        me.tbar = [];
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var rtTypeId = me.down('toolbar').getComponent('customTypeComp').getValue();
        var rtType = {_id: rtTypeId, idReference: 'RtType', clazz: domainObj['RtType']};
        var rtTypeData = {
            rtObject: null,
            rtType: null,
        };
        if (Ext.isEmpty(rtTypeId)) {
            return rtTypeData;
        }
        var rtObject = {};
        //var rtTypeId = me.getComponent('rtTypeId').getValue();
        if (me.data.rtObject) {
            var rtObjectData = {
                "_id": me.data.rtObject['_id'],
                "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                "idReference": "RtObject",
                "rtType": {
                    "_id": rtTypeId,
                    "idReference": "RtType",
                    "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                }
            };
            rtObjectData.objectJSON = me.valueJsonObject;
            var rtObjectString = JSON.stringify(rtObjectData);
            Ext.Ajax.request({
                url: adminPath + 'api/bom',
                method: 'POST',
                async: false,
                jsonData: [
                    {
                        "entities": [rtObjectString],
                        "entityName": "RtObject"
                    }
                ],
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    /*var responseMessage = Ext.JSON.decode(res.responseText);
                     rtTypeData.rtType = rtType;
                     rtTypeData.rtObject = rtObjectData;
                     return rtTypeData;*/
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
            rtTypeData.rtType = rtType;
            rtTypeData.rtObject = rtObjectData;
            return rtTypeData;

        } else {
            if (Ext.isEmpty(rtTypeId)) {
                rtTypeData = {

                };
                return rtTypeData;
            } else {
                Ext.Ajax.request({
                    url: adminPath + 'common/key',
                    method: 'GET',
                    async: false,
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        var rtObjectId = responseMessage.data;
                        var rtObjectData = {
                            "_id": rtObjectId.toString(),
                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                            "idReference": "RtObject",
                            "rtType": {
                                "_id": rtTypeId,
                                "idReference": "RtType",
                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                            },
                            "objectJSON": me.valueJsonObject
                        };
                        var rtObjectString = JSON.stringify(rtObjectData);
                        Ext.Ajax.request({
                            url: adminPath + 'api/bom',
                            method: 'POST',
                            async: false,
                            jsonData: [
                                {
                                    "entities": [rtObjectString],
                                    "entityName": "RtObject"
                                }
                            ],
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var response = Ext.JSON.decode(res.responseText);
                                if (response.success) {
                                    rtTypeData.rtObject = Ext.JSON.decode(response.data[0].entities[0]);
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
                rtTypeData.rtType = rtType;
                //rtTypeData.rtObject = rtObjectData;
                return rtTypeData;
            }
        }

    },
    refreshData: function (data) {
        var me = this;
        if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
            data.type = 'MaterialType'
        } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
            data.type = 'MaterialSpu'
        }
        me.data = data;
        me.valueJsonObject = {};
        me.down('toolbar').removeAll();
        if (data.rtObject) {
            Ext.Ajax.request({
                url: adminPath + 'api/bom/RtObject/' + data.rtObject['_id'] + '?includeReferenceEntity=false',
                method: 'GET',
                async: false,
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    if (responseMessage.success) {
                        var objectJSON = responseMessage.data.objectJSON;
                        me.objectJson = objectJSON;
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }
        var rtTypeStore;
        var rtTypeTreeCombo = {
            name: 'customTypeComp',
            xtype: 'rttypeselectfield',
            fieldLabel: i18n.getKey('rtType'),
            itemId: 'customTypeComp',
            haveReset: data.leaf,
            width: 450,
            parentMaterialRtType: null,//父节点的RtType，作为重置时的根节点，如果没有根节点为root
            /*            reset: function () {//注意清空时，处理me.data.rtType,和rtObject
                            this.value = undefined;
                            this.setRawValue('');
                            this.ids = [];
                            this.selectedRecords = [];
                            this.recordPath = {};
                            this.displayStr = [];
                            var picker = this.picker;
                            if (picker) {
                                var checkArr = picker.getChecked();
                                Ext.Array.each(checkArr, function (item) {
                                    if (me.multiselect) {
                                        item.set('checked', false);
                                    }
                                });
                                var selectionModel = picker.getSelectionModel();
                                if (selectionModel) {
                                    selectionModel.deselectAll();
                                }
                                if (picker.rendered == false) {
                                    //未进行渲染
                                } else {
                                    //已经渲染完成
                                    picker.toFront();
                                }
                            }
                            var treeStore = this.getStore();
                            treeStore.proxy.url = adminPath + 'api/rtTypes/{root}/children';
                            treeStore.clearFilter();
                            var node = new (treeStore.model)(this.parentMaterialRtType);
                            node.store = treeStore;
                            if (this.parentMaterialRtType._id == 'root') {
                                treeStore.proxy.extraParams = null;
                            } else {
                                treeStore.proxy.extraParams = {
                                    'filter': '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                                };
                            }
                            if (me.data) {
                                delete me.data.rtObject;
                                delete me.data.rtType;
                            }
                            treeStore.setRootNode(node);
                            treeStore.load({
                                start: 0,
                                page: 1,
                                limit: 25,
                                node: node
                            });
                            this.fireEvent('change', this, this.getValue());
                        },*/
            listeners: {
                afterrender: function (comp) {
                    comp.tree.expandAll();
                    if (data.rtType) {
                        comp.setInitialValue([data.rtType._id]);
                    } else {
                        comp.fireEvent('change', null, 'old');
                    }
                },
                change: function (comp, newValue, oldValue) {
                    if (!Ext.isEmpty(newValue)) {
                        me.getStore().proxy.url = adminPath + 'api/rtTypes/' + newValue + '/rtAttributeDefs';
                    } else {
                        me.getStore().proxy.url = adminPath + 'api/rtTypes/root/rtAttributeDefs';
                    }
                    me.getStore().load({
                        callback: function (records) {
                            me.expandAll();
                            //me.getSelectionModel().selectAll();
                        }
                    });

                }
            }
        };
        var checkRtType = {
            xtype: 'button',
            text: i18n.getKey('check') + i18n.getKey('rtType') + i18n.getKey('information'),
            handler: function (comp) {
                var rtTypeId = me.down('toolbar').getComponent('customTypeComp').getValue();
                JSOpen({
                    id: 'rttypespage',
                    url: path + "partials/rttypes/rttype.html?rtType=" + rtTypeId,
                    title: 'RtType',
                    refresh: true
                });
                //comp.ownerCt.ownerCt.getValue()
            }
        };
        if (Ext.isEmpty(data.parentMaterialType)) {//无父物料
            var params = null;
            if (data.rtType) {//若选择了指定的物料类型了
                params = {
                    filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                }
            }
            rtTypeStore = Ext.create('CGP.material.store.RtType', {
                root: {
                    _id: data.rtType ? data.rtType['_id'] : 'root',//有选择了RtType，和未选择物料
                    name: data.rtType ? data.rtType['name'] : null
                },
                params: params
            });
            rtTypeTreeCombo.store = rtTypeStore;
            rtTypeTreeCombo.parentMaterialRtType = {
                _id: 'root',
                name: null
            };
            me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
        } else {//有父物料
            Ext.Ajax.request({
                url: adminPath + 'api/materials/' + data.parentMaterialType["_id"],
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    var data = responseMessage.data;
                    if (responseMessage.success) {
                        if (data.rtType) {//父物料有rtType,获取到父物料的rtTpype名称
                            Ext.Ajax.request({
                                url: adminPath + 'api/rtTypes/' + data.rtType._id,
                                method: 'GET',
                                async: false,
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    if (responseMessage.success) {
                                        rtTypeTreeCombo.parentMaterialRtType = {
                                            _id: responseMessage.data._id,
                                            name: responseMessage.data.name
                                        };
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                            var rtTypeId = data.rtType._id;
                            if (me.data.rtType) {//父物料有rtType,子物料也选择了子rtType
                                Ext.Ajax.request({
                                    url: adminPath + 'api/rtTypes/' + me.data.rtType['_id'],
                                    method: 'GET',
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (res) {
                                        var responseMessage = Ext.JSON.decode(res.responseText);
                                        var rtTypeData = responseMessage.data;
                                        if (responseMessage.success) {
                                            rtTypeStore = Ext.create('CGP.material.store.RtType', {
                                                root: {
                                                    _id: me.data.rtType['_id'],
                                                    name: rtTypeData.name
                                                },
                                                params: {
                                                    filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                                                }
                                            });
                                            me.rootNode = rtTypeId;//父物料选择了指定的rtType
                                            rtTypeTreeCombo.store = rtTypeStore;
                                            rtTypeTreeCombo.rootVisible = true;
                                            me.down('toolbar').add(rtTypeTreeCombo, checkRtType)

                                        } else {
                                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                        }
                                    },
                                    failure: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                })
                            } else {//父物料有rtType,子物料未选择rtType
                                rtTypeStore = Ext.create('CGP.material.store.RtType', {
                                    root: {
                                        _id: data.rtType._id
                                    },
                                    params: {
                                        filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                                    }
                                });
                                rtTypeTreeCombo.store = rtTypeStore;
                                me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
                            }
                        } else {//父物料无rtType
                            rtTypeTreeCombo.parentMaterialRtType = {
                                _id: 'root',
                            };
                            rtTypeStore = Ext.create('CGP.material.store.RtType');
                            rtTypeTreeCombo.store = rtTypeStore;
                            me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
                        }
                    } else {
                        Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            })
        }
    }
});
