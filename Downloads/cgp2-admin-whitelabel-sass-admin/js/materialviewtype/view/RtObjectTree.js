Ext.define("CGP.materialviewtype.view.RtObjectTree", {
    extend: "Ext.tree.Panel",
    width: 575,
    height: 300,
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
    valueJsonObject: {},
    objectJson: {},
    itemId: 'rtTypeObject',
    data: {},
    rtTypeId: null,//是否指定了rtType
    hiddenValue: false,//是否隐藏Values列
    rootNode: 'root',
    hasReset: true,
    readOnly: false,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('rtObject');

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
                flex: 4,
                dataIndex: 'name',
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                flex: 7,
                dataIndex: 'value',
                sortable: false,
                hidden: me.hiddenValue,
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
        me.tbar = [

        ];
        me.callParent(arguments);
        var rtTypeStore;
        var rtTypeTreeCombo = {
            name: 'customTypeComp',
            xtype: 'uxtreecombohaspaging',
            fieldLabel: i18n.getKey('designType'),
            itemId: 'customTypeComp',
            displayField: 'name',
            valueField: '_id',
            haveReset: me.hasReset,
            editable: false,
            rootVisible: false,
            selectChildren: false,
            canSelectFolders: true,
            width: 380,
            readOnly: me.readOnly,
            infoUrl: adminPath + 'api/rtTypes/{id}',
            multiselect: false,
            defaultColumnConfig: {
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            reset: function () {
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
                treeStore.root = {
                    _id: me.rootNode,
                    name: ''
                };
                var node = new (treeStore.model)({'_id': me.rootNode});
                node.store = treeStore;
                var oldRootNode = treeStore.getRootNode();
                if (oldRootNode.getId() == node.getId()) {
                    //根节点未改变
                } else {
                    if (me.rootNode == 'root') {
                        treeStore.proxy.extraParams = null;
                        treeStore.setRootNode(node);
                        treeStore.load({
                            start: 0,
                            page: 1,
                            limit: 25,
                            node: node
                        });
                    } else {
                        treeStore.proxy.extraParams = {
                            'filter': '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                        };
                        treeStore.setRootNode(node);
                        treeStore.load({
                            start: 0,
                            page: 1,
                            limit: 25,
                            node: node
                        });
                    }
                }
                this.fireEvent('change', this, this.getValue());
            },
            showSelectColumns: [
                {
                    dataIndex: '_id',
                    flex: 1,
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    flex: 2
                }
            ],
            listeners: {
                /*//展开时显示选中状态
                 expand: function (field) {
                 var recursiveRecords = [];

                 function recursivePush(node, setIds) {
                 addRecRecord(node);
                 node.eachChild(function (nodesingle) {
                 if (nodesingle.hasChildNodes() == true) {
                 recursivePush(nodesingle, setIds);
                 } else {
                 addRecRecord(nodesingle);
                 }
                 });
                 };
                 function addRecRecord(record) {
                 for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                 var item = recursiveRecords[i];
                 if (item) {
                 if (item.getId() == record.getId()) return;
                 }
                 }
                 if (record.getId() <= 0) return;
                 recursiveRecords.push(record);
                 };
                 var node = field.tree.getRootNode();
                 recursivePush(node, false);
                 Ext.each(recursiveRecords, function (record) {
                 var id = record.get(field.valueField);
                 if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                 field.tree.getSelectionModel().select(record);
                 }
                 });
                 },*/
                /*         afterrender: function (comp) {
                 comp.tree.expandAll();
                 if (me.data) {
                 if (me.data.designType) {
                 if (me.data.designType._id) {
                 comp.setValue('');
                 comp.setValue(data.designType._id);
                 }
                 } else {
                 comp.setValue('root');
                 comp.setValue('');
                 }
                 }
                 },*/
                afterrender: function (comp) {
                    comp.tree.expandAll();
                    if (me.data || me.rtTypeId) {
                        if (me.data.designType) {
                            if (me.data.designType._id) {
                                comp.setInitialValue([me.data.designType._id]);
                            }
                        }
                        if (me.rtTypeId) {
                            comp.setInitialValue([me.rtTypeId]);
                        }
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
                        }});

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
        var params = null;
        if (me.rtTypeId) {//若选择了指定的物料类型了
            params = {
                filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
            }
        }
        rtTypeStore = Ext.create('CGP.material.store.RtType', {
            root: {
                _id: me.rtTypeId ? me.rtTypeId : 'root',//有选择了RtType，和未选择物料
                name: me.rtTypeId ? null : null
            },
            params: params
        });
        rtTypeTreeCombo.store = rtTypeStore;
        me.down('toolbar').add(rtTypeTreeCombo, checkRtType);

    },
    getJsonObjectValue:function (){
        var me = this;
        return me.valueJsonObject;
    },
    getValue: function () {
        var me = this;
        var rtTypeId = me.down('toolbar').getComponent('customTypeComp').getValue();
        var rtType = {_id: rtTypeId, idReference: 'RtType', clazz: domainObj['RtType']};
        var rtTypeData = {};
        if (Ext.isEmpty(rtTypeId)) {
            return rtTypeData;
        }
        var rtObject = {};
        //var rtTypeId = me.getComponent('rtTypeId').getValue();
        if (me.data.predesignObject) {
            var rtObjectData = {
                "_id": me.data.predesignObject['_id'],
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
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    if (!responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
            rtTypeData.designType = rtType;
            rtTypeData.predesignObject = rtObjectData;
            return rtTypeData;

        } else {
            if (Ext.isEmpty(rtTypeId)) {
                rtTypeData = {};
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
                                    rtTypeData.predesignObject = Ext.JSON.decode(response.data[0].entities[0]);
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
                rtTypeData.designType = rtType;
                //rtTypeData.rtObject = rtObjectData;
                return rtTypeData;
            }
        }

    },
    refreshData: function (data,notLoad) {
        var me = this;
        me.data = data;
        me.valueJsonObject = {};
        me.down('toolbar').removeAll();
        if (data.predesignObject&&!notLoad) {
            Ext.Ajax.request({
                url: adminPath + 'api/bom/RtObject/' + data.predesignObject['_id'] + '?includeReferenceEntity=false',
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
        else if(data.predesignObject){
            if(!Ext.Object.isEmpty(data.predesignObject.objectJSON)){
                me.objectJson =data.predesignObject.objectJSON;
            }
        }
        var rtTypeStore;
        var rtTypeTreeCombo = {
            name: 'customTypeComp',
            xtype: 'uxtreecombohaspaging',
            fieldLabel: i18n.getKey('designType'),
            itemId: 'customTypeComp',
            displayField: 'name',
            valueField: '_id',
            haveReset: me.hasReset,
            editable: false,
            rootVisible: false,
            readOnly: me.readOnly,
            selectChildren: false,
            canSelectFolders: true,
            width: 450,
            multiselect: false,
            infoUrl: adminPath + 'api/rtTypes/{id}',
            defaultColumnConfig: {
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            showSelectColumns: [
                {
                    dataIndex: '_id',
                    flex: 1,
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    flex: 2
                }
            ],
            reset: function () {
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
                treeStore.root = {
                    _id: me.rootNode,
                    name: ''
                };
                var node = new (treeStore.model)({'_id': me.rootNode});
                node.store = treeStore;
                var oldRootNode = treeStore.getRootNode();
                if (oldRootNode.getId() == node.getId()) {
                    //根节点未改变
                } else {
                    if (me.rootNode == 'root') {
                        treeStore.proxy.extraParams = null;
                        treeStore.setRootNode(node);
                        treeStore.load({
                            start: 0,
                            page: 1,
                            limit: 25,
                            node: node
                        });
                    } else {
                        treeStore.proxy.extraParams = {
                            'filter': '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                        };
                        treeStore.setRootNode(node);
                        treeStore.load({
                            start: 0,
                            page: 1,
                            limit: 25,
                            node: node
                        });
                    }
                }
                this.fireEvent('change', this, this.getValue());
            },

            listeners: {

                //展开时显示选中状态
                /*          expand: function (field) {
                 var recursiveRecords = [];

                 function recursivePush(node, setIds) {
                 addRecRecord(node);
                 node.eachChild(function (nodesingle) {
                 if (nodesingle.hasChildNodes() == true) {
                 recursivePush(nodesingle, setIds);
                 } else {
                 addRecRecord(nodesingle);
                 }
                 });
                 };
                 function addRecRecord(record) {
                 for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                 var item = recursiveRecords[i];
                 if (item) {
                 if (item.getId() == record.getId()) return;
                 }
                 }
                 if (record.getId() <= 0) return;
                 recursiveRecords.push(record);
                 };
                 var node = field.tree.getRootNode();
                 recursivePush(node, false);
                 Ext.each(recursiveRecords, function (record) {
                 var id = record.get(field.valueField);
                 if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                 field.tree.getSelectionModel().select(record);
                 }
                 });
                 },
                 afterrender: function (comp) {
                 comp.tree.expandAll();
                 if (me.data) {
                 if (me.data.designType) {
                 if (me.data.designType._id) {
                 comp.setValue('');
                 comp.setValue(data.designType._id);
                 }
                 } else {
                 comp.setValue('root');
                 comp.setValue('');
                 }
                 }
                 },*/
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
                        }});

                },
                afterrender: function (comp) {
                    comp.tree.expandAll();
                    if (me.rtTypeId) {
                        comp.setInitialValue([me.rtTypeId]);
                    } else {
                        comp.fireEvent('change', null, 'old');
                    }
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
        var params = null;
        if (data.predesignObject && data.predesignObject['rtType']._id) {//若选择了指定的物料类型了
            me.rtTypeId = data.predesignObject['rtType']._id;
            params = {
                filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
            }
            rtTypeStore = Ext.create('CGP.material.store.RtType', {
                root: {
                    _id: data.predesignObject['rtType']._id ? data.predesignObject['rtType']._id : 'root',//有选择了RtType，和未选择物料
                    name: data.predesignObject['rtType']._id ? null : null
                },
                params: params
            });
        } else {
            rtTypeStore = Ext.create('CGP.material.store.RtType');
        }
        rtTypeTreeCombo.store = rtTypeStore;
        me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
        /*var rtTypeStore;
         var rtTypeTreeCombo = {
         name: 'customTypeComp',
         xtype: 'treecombo',
         fieldLabel: i18n.getKey('designType'),
         itemId: 'customTypeComp',
         displayField: 'name',
         valueField: '_id',
         haveReset: true,
         editable: false,
         rootVisible: false,
         selectChildren: false,
         canSelectFolders: true,
         width: 380,
         multiselect: false,
         listeners: {
         //展开时显示选中状态
         expand: function (field) {
         var recursiveRecords = [];

         function recursivePush(node, setIds) {
         addRecRecord(node);
         node.eachChild(function (nodesingle) {
         if (nodesingle.hasChildNodes() == true) {
         recursivePush(nodesingle, setIds);
         } else {
         addRecRecord(nodesingle);
         }
         });
         };
         function addRecRecord(record) {
         for (var i = 0, j = recursiveRecords.length; i < j; i++) {
         var item = recursiveRecords[i];
         if (item) {
         if (item.getId() == record.getId()) return;
         }
         }
         if (record.getId() <= 0) return;
         recursiveRecords.push(record);
         };
         var node = field.tree.getRootNode();
         recursivePush(node, false);
         Ext.each(recursiveRecords, function (record) {
         var id = record.get(field.valueField);
         if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
         field.tree.getSelectionModel().select(record);
         }
         });
         },
         afterrender: function (comp) {
         comp.tree.expandAll();
         if (data.designType) {
         if (data.designType._id) {
         comp.setValue('');
         comp.setValue(data.designType._id);
         }
         } else {
         comp.setValue('root');
         comp.setValue('');
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
         }});

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
         rtTypeStore = Ext.create('CGP.material.store.RtType');
         rtTypeTreeCombo.store = rtTypeStore;
         me.down('toolbar').add(rtTypeTreeCombo, checkRtType)*/
    }
})
;
