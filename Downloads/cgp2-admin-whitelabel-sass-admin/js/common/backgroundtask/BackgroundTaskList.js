/**
 * @Description:
 * @author nan
 * @date 2022/6/27
 */
Ext.define('CGP.common.backgroundtask.BackgroundTaskList', {
    extend: 'Ext.view.BoundList',
    alias: 'widget.backgroundtasklist',
    autoScroll: true,
    selectedItemCls: 'x-view-selected',
    itemCls: 'diy_row',
    emptyText: '<font>无后台任务</font>',
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
        '<div  class="thumb-wrap diy_row"style="width:100%;display: flex;flex-wrap: nowrap;align-items: center;' +
        'border-style: solid;border-width: 1px 0px 1px 0px;border-color:silver; title="查看任务详情" ;>',
        '<div style="display:inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;flex-grow: 1;width:0;font-size: larger;"data-qtip="{title}">',
        '<font color="#157fcc">{index}.</font> {title}',
        '</div>',
        '<div style="display: inline-block;flex-shrink:1;">',
            '<tpl if="this.isMulti(taskDetail.requireType)" >',//分为两种进度条条
            '<progress value="{[values.taskDetail.rate]}" data-qtip="{[values.taskDetail.rate]}%" max="100" style="width:80px; margin-left: 5px;"></progress>',
            '</tpl>',
            '<tpl if="this.isPatch(taskDetail.requireType)" >',
            '<progress  max="100" data-qtip="运行中..." style="width:80px;margin-left: 5px;"></progress>',
            '</tpl>',
        '</div>',
        '<div style="display: inline-block;text-align: end;">',
        '<div style="display: inline-block" class="background_task">',
        '<img  data-qtip="删除" action="删除" alt="无法显示图片" src="{deleteSrc}" style="vertical-align: middle; width:16px;' +
        ' height:16px;cursor:pointer;margin-left:3px;margin-right: 3px;display:{[values.status==\'process\'?\'none\':\'initial\']}" >',
        '</div>',
        '<div style="display: inline-block;" class="background_task">',
        '<img data-qtip="重试" action="重试" alt="无法显示图片" src="{redoSrc}" style="vertical-align: middle; width:25px; height:25px;' +
        'cursor:pointer;margin-right: 3px; {[console.log(values.status)]} display:{[values.status==\'process\'?\'none\':\'initial\']}" >',
        '</div>',
        '<div style="display: inline-block" class="background_task">',
        '<img  data-qtip="查看错误信息" action="查看错误信息" alt="无法显示图片" src="{errorSrc}" style="vertical-align: middle; width:16px; ' +
        'height:16px;cursor:pointer;margin-right: 3px;display:{[values.status==\'failure\'?\'initial\':\'none\']}" >',
        '</div>',
        '</div>',
        '</div>',
        '</tpl>',
        {
            isMulti: function (type) {
                if (type == 'multi') {
                    return true;
                } else {
                    return false;
                }
            }, isPatch: function (type) {
                if (type == 'patch') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ),
    initComponent: function () {
        var me = this;
        me.callParent();
    }
});