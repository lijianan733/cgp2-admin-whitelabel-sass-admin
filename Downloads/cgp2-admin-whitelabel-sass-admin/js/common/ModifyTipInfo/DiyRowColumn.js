/**
 * @Description:提供显示该行修改信息的配置
 * @author nan
 * @date 2023/12/4
 */
Ext.define('CGP.common.ModifyTipInfo.DiyRowColumn', {
    extend: 'Ext.grid.column.RowNumberer',
    alias: 'widget.diy_row_column',
    tdCls: 'vertical-middle',
    tipInfoArr: ['当前配置受到属性变化影响'],//提示信息的数组
    dataIndex: 'errorInfo',
    handler: Ext.emptyFn,
    diyBuildImg: null,//自定义显示提示标签
    modifyInfo: null,//修改信息,showModifyTag操作中统计下来的记录
    initComponent: function () {
        var me = this;
        me.renderer = function (value, metaData, record, rowIdx, colIdx, store) {
            var rowspan = this.rowspan,
                page = store.currentPage,
                result = record.index;
            if (rowspan) {
                metaData.tdAttr = 'rowspan="' + rowspan + '"';
            }
            if (result == null) {
                result = rowIdx;
                if (page > 1) {
                    result += (page - 1) * store.pageSize;
                }
            }
            var isAdd = value;
            var img = '';
            var tipInfoArr =JSFormatModifyTipInfo(me.tipInfoArr);
            if (isAdd == true) {
                var cssStr = '';
                cssStr = 'icon_modify_tipInfo_show';
            }
            if (!Ext.Object.isEmpty(me.modifyInfo)) {
                if (me.modifyInfo[result]) {
                    cssStr = 'icon_modify_tipInfo_show';
                    tipInfoArr = me.modifyInfo[result].tipInfo;
                }
            }
            img = `<img role="button" alt="" index="${result + 1}" src="" class="modify_tag ${cssStr}"  data-qtip="${tipInfoArr}" />`;
            return (img + (result + 1));
        };
        me.callParent();
    },
    processEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
        var me = this,
            target = e.getTarget(),
            match,
            item, fn,
            key = type == 'keydown' && e.getKey(),
            disabled;
        if (key && !Ext.fly(target).findParent(view.getCellSelector())) {
            target = Ext.fly(cell).down('.icon_modify_tipInfo', true);
        }
        if (target) {
            if (type == 'click' || (key == e.ENTER || key == e.SPACE)) {
                fn = me.handler;
                if (fn) {
                    fn.call(me, view, recordIndex, cellIndex, item, e, record, row);
                }
            }
        }
        return me.callParent(arguments);
    },
    /**
     * 重写该方法，自定义获取数据的方式
     * @param data
     */
    showModifyTag: function (data) {
        var me = this;
        // me.addModifyTag(data);
    },
    /**
     *
     * @param data
     */
    addModifyTag: function (data) {
        var me = this;
        var mappingRules = data || [];
        var modifyInfo = {};
        if (mappingRules) {
            var imgs = me.up('tablepanel').el.select('.modify_tag');
            imgs.removeCls('icon_modify_tipInfo_show');
            imgs.addCls('icon_modify_tipInfo_hide');
            mappingRules?.map(function (item) {
                var index = item.index;

                var tipInfo = JSFormatModifyTipInfo(JSBuildModifyTipInfo(item));
                imgs.elements.map(function (imgEl) {
                    var imgIndex = imgEl.getAttribute('index') - 1;
                    if (index == imgIndex) {
                        imgEl.setAttribute('data-qtip', tipInfo);
                        Ext.fly(imgEl).removeCls('icon_modify_tipInfo_hide');
                        Ext.fly(imgEl).addCls('icon_modify_tipInfo_show');
                    }
                });
                modifyInfo[index + ''] = {
                    tipInfo: tipInfo,
                    raw: item
                }
            });
            me.modifyInfo = modifyInfo;
        }
    },
})