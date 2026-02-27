/**参照displayField
 * @Description:由于要添加跳转功能,只能修改组件模板,
 * 现在使用gotoConfigHandler即可实现该功能，但保留该组件实现方式，作为自定义组件例子
 * @author nan
 * @date 2022/1/25
 */
Ext.Loader.syncRequire([
    'CGP.material.store.RtType'
])
Ext.define('CGP.common.field.RtTypeSelectField', {
    extend: 'Ext.ux.tree.UxTreeComboHasPaging',
    alias: 'widget.rttypeselectfield',
    displayField: 'name',
    valueField: '_id',
    haveReset: true,
    treeWidth: 450,
    editable: false,
    rootVisible: false,
    selectChildren: false,
    canSelectFolders: true,
    multiselect: false,
    isHiddenCheckSelected: false,
    infoUrl: adminPath + 'api/rtTypes/{id}',
    baseFilter: [],//默认的过滤配置
    fieldSubTpl: [
        '<div class="{hiddenDataCls}" role="presentation"></div>',
        '<div id="{id}" role="input" {inputAttrTpl} class="{fieldCls} {typeCls} {editableCls}" autocomplete="off"',
        '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
        '<tpl if="name"> name="{name}"</tpl>',
        '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
        '<tpl if="size"> size="{size}"</tpl>',
        '<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>',
        '<tpl if="readOnly"> readonly="readonly"</tpl>',
        '<tpl if="disabled"> disabled="disabled"</tpl>',
        '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
        '/>',
        {
            compiled: true,
            disableFormats: true
        }
    ],
    gotoConfigHandler: function () {
        var rtTypeId = this.getValue();
        JSOpen({
            id: 'rttypespage',
            url: path + 'partials/rttypes/rttype.html?rtType=' + rtTypeId,
            title: 'RtType',
            refresh: true
        })
    },
    defaultColumnConfig: {
        renderer: function (value, metadata, record) {
            return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
        }
    },
    requestParamName: [
        {//查找类型的集合
            name: '按id查找',
            value: '{name:"id",type:"int"}'
        }, {
            name: '按名称查找',
            value: '{name:"name",type:"string"}'
        }
    ],
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
    getRawValue: function () {
        return this.rawValue.toString();
    },
    getDisplayValue: function () {
        var me = this,
            value = this.getRawValue(),
            display;
        if (me.renderer) {
            display = me.renderer.call(me.scope || me, value, me);
        } else {
            display = me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value;
        }
        return display;
    },
    setRawValue: function (value) {
        var me = this;

        value = Ext.value(me.transformRawValue(value), '');
        me.rawValue = value;
        if (me.rendered) {
            me.inputEl.dom.innerHTML = me.getDisplayValue();
            me.updateLayout();
        }
        return value;
    },
    diySetValue: function (id) {
        var me = this;
        me.setInitialValue(id);
    },
    renderer: function (value) {
        var me = this;
        if (value) {
            var arr = value.split(',');
            var newArr = arr.map(function (item, index, arr) {
                var rtTypeId = me.selectedRecords[index].getId();
                return (item + '<' + rtTypeId + '>');
            });
            return newArr.toString();
        } else {
            return '';
        }
    },
    doReset: function () {
        var materialSelectField = this.ownerCt.ownerCt.ownerTreeCombo;
        var info = this.ownerCt.items.items[0].getValue();
        info = Ext.JSON.decode(info);
        var treePanel = this.ownerCt.ownerCt;
        this.setValue(null);
        var store = treePanel.store;
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(materialSelectField.baseFilter)
        };
        if (info.name == 'id') {
            store.proxy.url = adminPath + 'api/rtTypes/root/children';
        } else {
            store.proxy.url = adminPath + 'api/rtTypes';
        }
        treePanel.store.load();
    },
    /**
     * 查询操作，需要处理切换查询目标时，切换接口
     */
    doSearch: function () {
        var materialSelectField = this.ownerCt.ownerCt.ownerTreeCombo;
        if (this.isValid() == false) {
            return;
        }
        var treePanel = this.ownerCt.ownerCt;
        var requestParamValue = this.getValue();
        var store = treePanel.store;
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(materialSelectField.baseFilter)
        };
        var oldUrl = '';
        if (!Ext.isEmpty(requestParamValue)) {
            var filter = null;
            var info = this.ownerCt.items.items[0].getValue();
            info = Ext.JSON.decode(info);
            if (info.name == 'id') {
                store.proxy.url = adminPath + 'api/rtTypes/' + requestParamValue + '/children';
                filter = Ext.JSON.encode([{
                    "name": "isQueryChildren",
                    "value": false,
                    "type": "boolean"
                }].concat(materialSelectField.baseFilter));
                oldUrl = adminPath + 'api/rtTypes/{id}/children';
            } else if (info.name == 'name' || info.name == 'category') {
                store.proxy.url = adminPath + 'api/rtTypes';
                filter = Ext.JSON.encode(
                    [{
                        'name': info.name,
                        'value': requestParamValue,
                        'type': info.type
                    }].concat(materialSelectField.baseFilter)
                );
                oldUrl = adminPath + 'api/rtTypes';
            }
            store.proxy.extraParams.filter = filter;
            store.load({
                params: {
                    filter: filter,
                    page: 1,//加载时必须为第一页
                }
            })
            store.proxy.url = oldUrl;
        }
    },
    initComponent: function () {
        var me = this;
        me.fieldStyle = Ext.Object.merge(me.fieldStyle || {}, {
            display: 'inline-table'
        });
        me.store = me.store || Ext.create('CGP.material.store.RtType');
        me.callParent();
        //处理使用非树结构的接口返回数据没leaf信息
        me.store.on('load', function (opt, parentNode, records) {
            if (records && records.length > 0) {
                for (var i = 0; i < records.length; i++) {
                    records[i].set('leaf', Ext.isEmpty(records[i].raw.leaf) || records[i].raw.leaf);
                }
            }
        });
    },

})
