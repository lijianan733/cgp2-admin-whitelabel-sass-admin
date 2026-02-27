/**
 * Created by nan on 2020/10/23
 * 把profile的数据转成一棵树，至能选择树种的子节点来选择
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.AttributeTreeCombo', {
    extend: 'Ext.ux.tree.UxTreeCombo',
    alias: 'widget.attributetreecombo',
    forceSelection: false,
    displayField: 'text',
    allowBlank: false,
    valueField: 'id',
    editable: false,
    dataIndex: 'text',
    multiselect: false,
    rootVisible: false,
    matchFieldWidth: false,
    haveReset: true,
    extraColumn: [
        {
            dataIndex: 'attribute',
            tdCls: 'vertical-middle',
            text: i18n.getKey('valueType'),
            renderer: function (value, metadata, record) {
                if (value) {
                    return value.valueType;
                }
            }
        },
        {
            dataIndex: 'attribute',
            tdCls: 'vertical-middle',
            text: i18n.getKey('selectType'),
            renderer: function (value, metadata, record) {
                if (value) {
                    var selectType = value.selectType;
                    var str = '';
                    if (selectType == 'NON') {
                        str = '输入型';
                    } else if (selectType == 'MULTI') {
                        str = '多选型';
                    } else {
                        str = '单选型';
                    }
                    return str;
                }
            }
        },
    ],
    hideTopBar: true,
    haveRest: true,
    treePanelConfig: {
        width: 600,
        listeners: {
            afterrender: function (treePanel) {
                treePanel.expandAll();
            },
            beforeselect: function (selectModel, record) {
               ;
                if (record.get('type') == 'attribute') {
                    return true;
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择属性节点'))
                    return false;
                }
            }
        }
    },
    profileStore: null,//需要一个已经加载完数据的profileStore
    rawData: null,//不能使用value字段，会自动调用treeCombo的设置值方法
    diySetValue: function (data) {
        var me = this;
        if (data) {
            if (Ext.isArray(data)) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].groupId + '_' + data[i].skuAttributeId + '_' + data[i].attributeId;
                    arr.push(id);
                }
                me.setValue(arr.toString());
            } else {
                var id = data.groupId + '_' + data.skuAttributeId + '_' + data.attributeId;
                me.setValue(id);
            }
        }
        console.log(data)

    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        if (data) {
            if (me.multiselect == true) {
                var arr = [];
                data = data.split(',');
                for (var i = 0; i < data.length; i++) {
                    var item = data[i].split('_');
                    arr.push({
                        groupId: item[0],
                        skuAttributeId: item[1],
                        attributeId: item[2]
                    })
                }
                return arr;
            } else {
                data = data.split('_');
                return {
                    groupId: data[0],
                    skuAttributeId: data[1],
                    attributeId: data[2]
                }
            }
        } else {
            return null;
        }

    },
    buildTreeData: function (profileStore) {
        //转换profileStore为一棵指定格式的
        var me = this;
        var treeData = [];
        for (var i = 0; i < profileStore.getCount(); i++) {
            var profile = profileStore.getAt(i).getData();
            var groups = profile.groups;
            var groupsData = [];
            for (var j = 0; j < groups.length; j++) {
                var group = groups[j];
                var attributes = [];
                group.attributes.forEach(function (item) {
                    var config = {
                        partnerId: profile._id + '_' + group._id,
                        text: item.displayName + ' (' + item.id + ')',
                        type: 'attribute',
                        leaf: true,
                        attribute: item.attribute,
                        id: group._id + '_' + item.id + '_' + item.attribute.id,
                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/node.png',
                    };
                    if (me.multiselect == true) {
                        config.checked = false;
                    }
                    attributes.push(config)
                })
                groupsData.push({
                    text: 'group_' + group.name + ' (' + group._id + ')',
                    type: 'group',
                    leaf: false,
                    partnerId: profile._id,
                    id: profile._id + '_' + group._id,
                    icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png',
                    children: attributes
                })
            }
            treeData.push({
                text: 'profile_' + profile.name + ' (' + profile._id + ')',
                type: 'profile',
                leaf: false,
                id: profile._id,
                icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png',
                children: groupsData
            })
        }
        return treeData;
    },
    initComponent: function () {
        var me = this;
        var treeData = me.buildTreeData(me.profileStore);
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: [
                '_id', 'text', 'children', 'type', 'attribute'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: treeData
            }
        });
        me.callParent();
        me.on('afterrender', function () {
            var treeCombo = this;
            if (treeCombo.rawData) {
                treeCombo.diySetValue(treeCombo.rawData);
            }
        })
    }
})

