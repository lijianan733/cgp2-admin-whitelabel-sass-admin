/**
 * Created by nan on 2021/7/15
 */
Ext.define("CGP.editviewtypeconfigv3.config.Config", {
    statics: {
        layoutTemplates: {
            single: [
                '<div>${component}</div>'
            ],
            tab: [
                '<uib-tabset class="tabset__container"justified="false"class="tabset">${items}</uib-tabset>',
                '<uib-tab heading="${title}"index="${index}">${component}</uib-tab>'
            ],
            accordion: [
                '<uib-accordion class="accordion">${items}</uib-accordion>',
                '<div uib-accordion-group is-open="true"heading="${title}"class="panel-default">${component}</div>'
            ],
            border: [
            '<div class="builder-documentView"ng-style="{ bottom: ctrl.size.builderView.bottom }">' +
            '<div class="builder-documentView__Assistant"uib-collapse="ctrl.componentViewCollapsed.isCollapsedDocument">' +
            '<div class="builder-documentView__ToolTips">${ToolTips}</div>' +
            '<div class="builder-documentView__AssistBar">${AssistBar}</div></div>' +
            '<div class="builder-documentView__DocumentTop"ng-style="{ top: ctrl.size.documentView.assistantHeight }"uib-collapse="ctrl.componentViewCollapsed.isCollapsedDocument">${DocumentTop}</div>' +
            '<div class="builder-documentView__DocumentMiddle"ng-style="{top:ctrl.size.documentView.top,bottom:ctrl.size.documentView.bottom}">' +
            '<div class="builder-documentView__DocumentLeft"uib-collapse="ctrl.componentViewCollapsed.isCollapsedDocument"horizontal>${DocumentLeft}</div>' +
            '<div class="builder-documentView__DocumentComponent"ng-style="{left:ctrl.size.documentView.left,right:ctrl.size.documentView.right}">${DocumentComponent}</div>' +
            '<div class="builder-documentView__DocumentRight"uib-collapse="ctrl.componentViewCollapsed.isCollapsedDocument"horizontal>${DocumentRight}</div></div>' +
            '<div class="builder-documentView__DocumentBottom"uib-collapse="ctrl.componentViewCollapsed.isCollapsedDocument">${DocumentBottom}</div></div>'
            ]
        }
    }
})