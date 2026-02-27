/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.define('CGP.common.typesettingschedule.view.LineContainer', {
    extend: 'Ext.Component',
    alias: 'widget.line_container',
    margin: '5px 0px',
    width: 20,
    height: 35,
    indexEnd: false,
    initComponent: function () {
        var me = this;
        me.renderTpl = [
            '<tpl>',
            '<div class="link-line-box" style="display: inline-block;width: 50%;height: 100%;">',
            '<div class="line-box" style="display: inline-block;width: 100%;height: 100%;">',
            '<div class="link-line link-line-top"  style="width: {width};height: {height}; border-left: {indexEnd}"></div>',
            '</div>',
            '</div>',
            '</tpl>',
        ];
        //执行后样式
        this.callParent();
    },
    initRenderData: function () {
        var me = this;
        return {
            width: me.width - 5 + 'px',
            height: me.height + 'px',
            indexEnd: me.indexEnd ? 'block' : 'none'
        };
    },
})