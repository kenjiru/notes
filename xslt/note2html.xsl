<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:tomboy="http://beatniksoftware.com/tomboy"
                xmlns:size="http://beatniksoftware.com/tomboy/size"
                xmlns:link="http://beatniksoftware.com/tomboy/link"
                version='1.0'>

    <xsl:output method="html" indent="no" />
    <xsl:preserve-space elements="*" />

    <xsl:param name="font" />
    <xsl:param name="export-linked" />
    <xsl:param name="export-linked-all" />
    <xsl:param name="root-note" />

    <xsl:param name="newline" select="'&#xA;'" />

    <xsl:template match="/">
        <xsl:apply-templates select="tomboy:note"/>
    </xsl:template>

    <xsl:template match="text()">
        <xsl:call-template name="softbreak"/>
    </xsl:template>

    <xsl:template name="softbreak">
        <xsl:param name="text" select="."/>
        
        <xsl:choose>
            <xsl:when test="contains($text, $newline)"> <!-- Unix Line Feed -->
                <xsl:value-of select="substring-before($text, $newline)"/>

                <xsl:call-template name="softbreak">
                    <xsl:with-param name="text" select="substring-after($text, $newline)"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$text"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="tomboy:note">
        <xsl:apply-templates select="tomboy:text"/>
    </xsl:template>

    <xsl:template match="tomboy:text">
        <div class="note"
             id="{/tomboy:note/tomboy:title}">
            <a name="#{/tomboy:note/tomboy:title}" />
            <xsl:apply-templates select="node()" />
        </div>

        <xsl:if test="$export-linked and ((not($export-linked-all) and /tomboy:note/tomboy:title/text() = $root-note) or $export-linked-all)">
            <xsl:for-each select=".//link:internal/text()">
                <!-- Load in the linked note's XML for processing. -->
                <xsl:apply-templates select="document(.)/node()"/>
            </xsl:for-each>
        </xsl:if>
    </xsl:template>

    <xsl:template match="tomboy:note/tomboy:text/*[1]/text()[1]">
        <h1><xsl:value-of select="substring-before(., $newline)"/></h1>
        <xsl:value-of select="substring-after(., $newline)"/>
    </xsl:template>

    <xsl:template match="tomboy:bold">
        <b><xsl:apply-templates select="node()"/></b>
    </xsl:template>

    <xsl:template match="tomboy:italic">
        <i><xsl:apply-templates select="node()"/></i>
    </xsl:template>

    <xsl:template match="tomboy:strikethrough">
        <strike><xsl:apply-templates select="node()"/></strike>
    </xsl:template>

    <xsl:template match="tomboy:highlight">
        <span style="background:yellow"><xsl:apply-templates select="node()"/></span>
    </xsl:template>

    <xsl:template match="tomboy:datetime">
        <span style="font-style:italic;font-size:small;color:#888A85">
            <xsl:apply-templates select="node()"/>
        </span>
    </xsl:template>

    <xsl:template match="size:small">
        <span style="font-size:small"><xsl:apply-templates select="node()"/></span>
    </xsl:template>

    <xsl:template match="size:large">
        <span style="font-size:large"><xsl:apply-templates select="node()"/></span>
    </xsl:template>

    <xsl:template match="size:huge">
        <span style="font-size:xx-large"><xsl:apply-templates select="node()"/></span>
    </xsl:template>

    <xsl:template match="link:broken">
        <span style="color:#555753;text-decoration:underline">
            <xsl:value-of select="node()"/>
        </span>
    </xsl:template>

    <xsl:template match="link:internal">
        <a style="color:#204A87" href="#{node()}">
            <xsl:value-of select="node()"/>
        </a>
    </xsl:template>

    <xsl:template match="link:url">
        <a style="color:#3465A4" href="{node()}"><xsl:value-of select="node()"/></a>
    </xsl:template>

    <xsl:template match="tomboy:list">
        <ul>
            <xsl:apply-templates select="tomboy:list-item" />
        </ul>
    </xsl:template>

    <xsl:template match="tomboy:list-item">
        <li>
            <xsl:if test="normalize-space(text()) = ''">
                <xsl:attribute name="style">list-style-type: none</xsl:attribute>
            </xsl:if>
            <xsl:attribute name="dir">
                <xsl:value-of select="@dir"/>
            </xsl:attribute>
            <xsl:apply-templates select="node()" />
        </li>
    </xsl:template>

</xsl:stylesheet>