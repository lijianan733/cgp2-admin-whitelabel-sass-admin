/**
 * Created by nan on 2020/8/24.
 * 数下面有三种节点 layer container 和具体的内容组件
 */
Ext.define('CGP.pagecontentschema.view.LayerLeftTreePanel', {
    extend: "Ext.tree.Panel",
    itemId: 'layerLeftTreePanel',
    alias: 'widget.layerlefttreepanel',
    width: 450,
    collapsible: true,
    region: 'west',
    header: false,
    rootVisible: false,
    useArrows: true,
    split: true,
    autoScroll: true,
    deselectRecord: null,//即将取消的记录
    rootType: 'layer',//container和layer两种选择
    viewConfig: {
        listeners: {
            beforedrop: function (node, data, overModel, dropPosition, dropHandlers) {
                dropHandlers.wait = true;
                var dragNode = data.records[0];//拖动的节点
                var dropNode = overModel;//放下时目标节点
                //dropPosition 值有after before append
                if (dragNode.get('clazz') == 'Layer') {
                    if (dropNode.get('clazz') == 'Layer' && Ext.Array.contains(['after', 'before'], dropPosition)) {
                    } else {
                        Ext.Msg.alert('Drop', 'layer节点只能在最外层');
                        return false;

                    }
                } else if (dragNode.get('clazz') != 'Layer') {
                    if (dropNode.parentNode.isRoot() && Ext.Array.contains(['after', 'before'], dropPosition)) {
                        Ext.Msg.alert('Drop', dragNode.get('clazz') + '节点只能在Layer层中');
                        return false;
                    }

                }
                Ext.MessageBox.confirm(i18n.getKey('prompt'), '是否确定移动?', function (btn) {
                    if (btn === 'yes') {
                        dropHandlers.processDrop();
                    } else {
                        dropHandlers.cancelDrop();
                    }
                });
            },
            //注释掉移动节点后把选中状态取消的逻辑
            afterrender: function () {
                //这个方法是来判断是否启动拖拽，return true就是开始启动
                this.plugins[0].dragZone.onBeforeDrag = function (args, event) {
                    //这东西只要有点击，就执行是否开始拖拽，无解
                    console.log(args);
                }
                //原生的树在拖拽放下节点后将会把所有的选中清空，现在不需清空
                this.plugins[0].dropZone.handleNodeDrop = function (data, targetNode, position) {
                    var me = this,
                        targetView = me.view,
                        parentNode = targetNode ? targetNode.parentNode : targetView.panel.getRootNode(),
                        Model = targetView.getStore().treeStore.model,
                        records, i, len, record,
                        insertionMethod, argList,
                        needTargetExpand,
                        transferData;
                    if (data.copy) {
                        records = data.records;
                        data.records = [];
                        for (i = 0, len = records.length; i < len; i++) {
                            record = records[i];
                            if (record.isNode) {
                                data.records.push(record.copy(undefined, true));
                            } else {

                                data.records.push(new Model(record.data, record.getId()));
                            }
                        }
                    }
                    me.cancelExpand();
                    if (position == 'before') {
                        insertionMethod = parentNode.insertBefore;
                        argList = [null, targetNode];
                        targetNode = parentNode;
                    } else if (position == 'after') {
                        if (targetNode.nextSibling) {
                            insertionMethod = parentNode.insertBefore;
                            argList = [null, targetNode.nextSibling];
                        } else {
                            insertionMethod = parentNode.appendChild;
                            argList = [null];
                        }
                        targetNode = parentNode;
                    } else {
                        if (!(targetNode.isExpanded() || targetNode.isLoading())) {
                            needTargetExpand = true;
                        }
                        insertionMethod = targetNode.appendChild;
                        argList = [null];
                    }
                    transferData = function () {
                        var color,
                            n;
                        Ext.suspendLayouts();

                        /*
                                    targetView.getSelectionModel().clearSelections();
                        */
                        for (i = 0, len = data.records.length; i < len; i++) {
                            record = data.records[i];
                            if (!record.isNode) {
                                if (record.isModel) {
                                    record = new Model(record.data, record.getId());
                                } else {
                                    record = new Model(record);
                                }
                                data.records[i] = record;
                            }
                            argList[0] = record;
                            insertionMethod.apply(targetNode, argList);
                        }
                        if (me.sortOnDrop) {
                            targetNode.sort(targetNode.getOwnerTree().store.generateComparator());
                        }
                        Ext.resumeLayouts(true);
                        if (Ext.enableFx && me.dropHighlight) {
                            color = me.dropHighlightColor;

                            for (i = 0; i < len; i++) {
                                n = targetView.getNode(data.records[i]);
                                if (n) {
                                    Ext.fly(n).highlight(color);
                                }
                            }
                        }
                    };
                    if (needTargetExpand) {
                        targetNode.expand(false, transferData);
                    } else if (targetNode.isLoading()) {
                        targetNode.on({
                            expand: transferData,
                            delay: 1,
                            single: true
                        });
                    } else {
                        transferData();
                    }
                }
            }
        },
        plugins: {
            ptype: 'treeviewdragdrop',
        }
    },
    diyTbar: null,//自己定义特殊的工具栏
    objectValueEqual: function (val1, val2) {
        var me = this;
        if (Ext.Object.isEmpty(val1) || Ext.Object.isEmpty(val2)) {
            if (Ext.Object.isEmpty(val1) && Ext.Object.isEmpty(val2)) {
                return true;
            } else {
                console.log("val1:");
                console.log(val1);
                console.log("val2:");
                console.log(val2);
                return false;
            }
        }
        var val1PropertyNameArray = Object.getOwnPropertyNames(val1);//获取到对象中所有的属性名的数组
        var val2PropertyNameArray = Object.getOwnPropertyNames(val2);//获取到对象中所有的属性名的数组
        if (val1PropertyNameArray.length != val2PropertyNameArray.length) {
            console.log("val1PropertyNameArray:");
            console.log(val1PropertyNameArray);
            console.log("val2PropertyNameArray:");
            console.log(val2PropertyNameArray);
            return false;
        }
        for (var i = 0; i < val1PropertyNameArray.length; i++) {
            var propName = val1PropertyNameArray[i];
            var propA = val1[propName];
            var propB = val2[propName];
            if ((typeof (propA) === 'object')) {
                if (me.objectValueEqual(propA, propB)) {
                    //return true
                } else {
                    console.log("propA:");
                    console.log(propA);
                    console.log("propB:");
                    console.log(propB);
                    return false
                }
            } else {
                if (propA == propB) {

                } else {
                    console.log("propA:");
                    console.log(propA);
                    console.log("propB:");
                    console.log(propB);
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * 清除数据中的null值键值对
     * isClearNullString是否清楚’‘字符
     * excludeKeys 排除，不作处理的字段
     */
    setValue: function (data) {
        var me = this;
        var layers = data.layers;
        //转换数据结
        if (layers && layers.length > 0) {
            var rootNode = me.store.getRootNode();
            rootNode.removeAll()
            JSReplaceKeyName(data.layers, 'items', 'children');
            //如果是container类型，必须有items
            JSObjectEachItem(data, function (data, i) {
                if (data.clazz == 'Container') {
                    if (data.items) {
                    } else {
                        data.items = [];
                    }
                }
            })
            rootNode.appendChild(layers);
            me.expandAll();
        }
    },
    getValue: function () {
        var me = this;
        var rootNode = me.getRootNode();
        var data = {};
        if (rootNode.hasChildNodes() == false) {//只有根
            data.layers = [];
        } else {
            data = JSTreeNodeToJsonTree(rootNode, {children: []});
            JSReplaceKeyName(data, 'children', 'items');
            data.layers = data.items;
            delete data.items;
        }
        return data;
    },
    /**
     * 呼出鼠标右键菜单操作
     * @param node
     * @param record
     * @param item
     * @param index
     * @param e
     * @param eOpts
     */
    showRightClickMenu: function (node, record, item, index, e, eOpts) {
        e.stopEvent();
        var treePanel = this;
        var clazz = record.get('clazz');
        var nodemenu = new Ext.menu.Menu({
            items: [
                {
                    text: "添加Container",
                    hidden: !(clazz == 'Layer' || clazz == 'Container'),
                    handler: function () {
                        treePanel.ownerCt.el.mask('加载中...');
                        treePanel.ownerCt.updateLayout();
                        setTimeout(function () {
                            console.log(new Date());
                            treePanel.controller.addDisplayObjectWin(null, 'Container', treePanel, record);
                            treePanel.ownerCt.el.unmask();
                            console.log(new Date());
                        }, 100)
                    }
                },
                {

                    text: "添加DisplayObject",
                    hidden: !(clazz == 'Layer' || clazz == 'Container'),
                    handler: function () {
                        treePanel.controller.selectDisplayObjectType(treePanel, record);
                    }
                },
                {
                    text: "复制结点",
                    cls: 'x-btn-text-icon',
                    handler: function () {
                        treePanel.controller.copyNode(treePanel, record);
                    }
                },
                {
                    text: "删除结点",
                    cls: 'x-btn-text-icon',
                    handler: function () {
                        Ext.MessageBox.confirm("提示", "是否确定删除？", function (e) {
                            if (e == "yes") {
                                record.remove();
                                treePanel.deselectRecord = null;
                                var tab = treePanel.ownerCt;
                                var centerPanel = tab.getComponent('centerPanel');
                                tab.el.mask('加载中...');
                                tab.updateLayout();
                                setTimeout(function () {
                                    centerPanel.refreshData(null);
                                    tab.el.unmask();
                                }, 100)
                            }
                        });
                    }
                }
            ]
        });
        nodemenu.showAt(e.getPoint());//menu的showAt，不要忘记
    },
    /**
     * 补全旧数据里面的默认值，和一些转换数据处理
     * 规则如下：
     * tags默认为一个空[]，
     * readOnly默认为false
     * 该操作在选中节点的时候进行
     */
    completeDefaultValue: function (record) {
        console.log(record);
        var defaultValueMap = {
            tags: [],
            readOnly: false,
        };
        //在以下类型的组件里才有的默认字段
        var specialMap = {
            Image: {
                printFile: '',
                imageName: ''
            },
            UploadPicture: {
                printFile: '',
                imageName: ''
            },
            Picture: {
                printFile: '',
                imageName: ''
            }
        };
        var rawData = record.raw;
        for (var i in defaultValueMap) {
            if (rawData.hasOwnProperty(i)) {//是否有该属性
                //特殊处理以前的tags数据，之前是存一个‘’字符，现在改为[]
                if (i == 'tags' && rawData[i] === '') {
                    rawData[i] = [];
                }
            } else {
                rawData[i] = defaultValueMap[i];
            }
        }
        if (specialMap.hasOwnProperty(rawData['clazz'])) {//是特定组件
            var specialDefaultValue = specialMap[rawData['clazz']];
            for (var i in specialDefaultValue) {
                if (rawData.hasOwnProperty(i)) {//是否有该属性
                } else {
                    rawData[i] = specialDefaultValue[i];
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.pagecontentschema.controller.Controller');
        var localModel = Ext.define('localModel', {
            extend: 'Ext.data.Model',
            idProperty: '_id',
            fields: [
                {
                    name: '_id',
                    type: 'string',
                    convert: function (value, record) {
                        var id = value || JSGetCommonKey(false);
                        if (record) {
                            record.raw._id = id;
                        }
                        if (value) {
                            return id;
                        } else {
                            return id;
                        }
                    }
                }, {
                    name: 'clazz',
                    type: 'string'
                }, {
                    name: 'icon',
                    type: 'string',
                    convert: function (value, record) {
                        var type = record.get('clazz');
                        var icon = '';
                        console.log(type)
                        if (type == 'Layer') {
                            icon = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_purple.png';
                        } else if (type == 'Container') {
                            icon = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_yellow.png';
                        } else {
                            icon = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png';
                        }
                        return icon;
                    }
                },
                {//节点是否允许拖拽放下其他节点
                    name: 'allowDrop',
                    type: 'boolean',
                    convert: function (value, record) {
                        var clazz = record.get('clazz');
                        if (clazz == 'Layer') {
                            return true;
                        } else if (clazz == 'Container') {
                            return true;
                        } else if (clazz == 'root') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    name: 'description',
                    type: 'string',
                    useNull: true,
                }, {
                    name: 'data',
                    type: 'object',
                    convert: function (value, record) {
                        if (Ext.isEmpty(value) || Ext.Object.isEmpty(value)) {
                            return record.raw;
                        } else {
                            return value;
                        }
                    }
                }]
        });
        var store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            autoSync: true,
            model: localModel,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            //太多可能的子类字段，故直接用rawData来获取数据
            root: {
                expanded: true,
                allowDrop: true,
                clazz: 'root',
                children: []
            },
            listeners: {
                datachanged: function (store) {
                    console.log(store);
                    var rootNode = store.getRootNode();
                    var tree = store.ownerTree;
                    if (tree.rootType == 'layer') {

                    } else if (tree.rootType == 'container') {
                        var toolbar = tree.getDockedItems('toolbar[dock="top"]')[0];
                        var addBtn = toolbar.getComponent('addBtn');
                        if (addBtn) {
                            //container类型只能有一个顶层节点
                            if (rootNode.hasChildNodes()) {
                                addBtn.setDisabled(true);
                            } else {
                                addBtn.setDisabled(false);
                            }
                        }
                    }
                }
            }
        });
        me.store = store;
        me.tbar = me.diyTbar || [
            {
                xtype: 'button',
                text: me.rootType == 'layer' ? i18n.getKey('add') + i18n.getKey('layer') : i18n.getKey('add') + i18n.getKey('container'),
                iconCls: 'icon_add',
                itemId: 'addBtn',
                handler: function (btn) {
                    var treePanel = btn.ownerCt.ownerCt;
                    var rootNode = treePanel.getRootNode();
                    if (treePanel.rootType == 'layer') {
                        rootNode.appendChild({
                            clazz: 'Layer',
                            clipPath: null,
                            tags: [],
                            readOnly: false,
                            _id: JSGetCommonKey(false)
                        })
                    } else {
                        treePanel.ownerCt.el.mask('加载中...');
                        treePanel.ownerCt.updateLayout();
                        setTimeout(function () {
                            treePanel.controller.addDisplayObjectWin(null, 'Container', treePanel, rootNode);
                            treePanel.ownerCt.el.unmask();
                        }, 100);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('expandAll'),
                iconCls: 'icon_expandAll',
                count: 0,
                handler: function (btn) {
                    var treepanel = btn.ownerCt.ownerCt;
                    if (btn.count % 2 == 0) {
                        treepanel.expandAll();
                        btn.setText(i18n.getKey('collapseAll'));
                        btn.setIconCls('icon_collapseAll');

                    } else {
                        treepanel.collapseAll();
                        btn.setText(i18n.getKey('expandAll'));
                        btn.setIconCls('icon_expandAll');
                    }
                    btn.count++;
                }
            },
            '->',
            {
                xtype: 'displayfield',
                fieldStyle: {
                    color: 'red'
                },
                value: '可拖拽改变树中节点位置'

            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('clazz'),
                flex: 1,
                dataIndex: 'clazz',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return value + '(' + record.get('_id') + ')';
                }
            }
        ];
        me.listeners = {
            /**
             * 选择其他的选项时的校验
             * 该校验方式是通过比较旧数据和表单里的数据，
             * 当切换过于快，组件的渲染设置值过程还未完成时，会发生未发生修改当提示编辑的问题
             * @param rowModel
             * @param record
             * @param index
             * @returns {boolean}
             */
            beforeselect: function (rowModel, record, index) {
                console.log('beforeselect');
                var treePanel = rowModel.view.ownerCt;
                treePanel.completeDefaultValue(record);
                var centerPanel = treePanel.ownerCt.getComponent('centerPanel');
                if (treePanel.deselectRecord) {
                    if (centerPanel.isValid() == false) {
                        treePanel.getSelectionModel().select(treePanel.deselectRecord, false, true);
                        //这个地方会取消选中的节点，会使拖拽操作报错
                        Ext.dd.DragDropManager.stopDrag();
                        return false;
                    }
                    var newValue = centerPanel.getValue();
                    var oldValue = treePanel.deselectRecord.get('data');
                    treePanel.controller.clearNullValueKey(newValue, true, ['printFile', 'imageName', 'text', 'color']);
                    treePanel.controller.clearNullValueKey(oldValue, true, ['printFile', 'imageName', 'text', 'color']);
                    console.log(newValue._id + '-' + oldValue._id);
                    if (treePanel.objectValueEqual(treePanel.deselectRecord.get('data'), newValue)) {
                        return true;
                    } else {
                        //这个地方会取消选中的节点，会使拖拽操作报错
                        Ext.dd.DragDropManager.stopDrag();

                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否保存编辑区域的修改?'), function (selector) {
                            if (selector == 'yes') {
                                if (centerPanel.items.items[0].isValid()) {
                                    treePanel.deselectRecord.set('data', newValue);
                                    treePanel.deselectRecord.raw = newValue;
                                    rowModel.select(record);
                                } else {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('配置未完备'));

                                }
                            } else {
                                treePanel.deselectRecord = null;
                                rowModel.select(record);
                            }
                        })
                        return false;
                    }
                }
            },
            beforedeselect: function (rowModel, record, index) {
                console.log('beforedeselect');
                var treePanel = rowModel.view.ownerCt;
                treePanel.deselectRecord = record;
            },
            select: function (selectModel, record) {
                var leftTreePanel = selectModel.view.ownerCt;
                var centerPanel = leftTreePanel.ownerCt.getComponent('centerPanel');
                var tab = leftTreePanel.ownerCt;
                centerPanel.setLoading(true);
                setTimeout(function () {
                    centerPanel.refreshData(record);
                    centerPanel.setLoading(false);

                }, 100);
            },
            itemcontextmenu: me.showRightClickMenu,
        };
        me.callParent(arguments);
    },
})
