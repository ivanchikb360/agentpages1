import React, { useState, useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Slider } from "../../components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { Button } from "../../components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"
import { ChevronDown, ChevronRight, Wand2 } from "lucide-react"
import { toast } from 'react-hot-toast'

interface EditingMenuProps {
  selectedElementId: string | null
  setSelectedElementId: (id: string | null) => void
  canvasContent: any[]
  setCanvasContent: (content: any[]) => void
  onEnhanceSection?: (sectionId: string) => Promise<void>
}

export const EditingMenu = ({
  selectedElementId,
  setSelectedElementId,
  canvasContent,
  setCanvasContent,
  onEnhanceSection,
}: EditingMenuProps) => {
  const selectedElement = canvasContent.find((element) => element.id === selectedElementId)
  const [style, setStyle] = useState<any>({})
  const [openSections, setOpenSections] = useState<string[]>([
    "Layout",
    "Typography",
    "Background",
    "Border",
    "Advanced",
  ])

  useEffect(() => {
    if (selectedElement) {
      setStyle(selectedElement.style || {})
    } else {
      setStyle({})
    }
  }, [selectedElement])

  const updateElement = (updates: any) => {
    const updatedContent = canvasContent.map((element) =>
      element.id === selectedElementId ? { ...element, ...updates } : element,
    )
    setCanvasContent(updatedContent)
  }

  const handleStyleChange = (property: string, value: string | number) => {
    const newStyle = { ...style, [property]: value }
    setStyle(newStyle)
    updateElement({ style: newStyle })
  }

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionName) ? prev.filter((name) => name !== sectionName) : [...prev, sectionName],
    )
  }

  const getEnhancePrompt = (type: string) => {
    switch (type) {
      case 'description':
        return 'Enhance property description with more engaging content'
      case 'neighborhood':
        return 'Generate detailed neighborhood insights'
      case 'testimonials':
        return 'Generate authentic testimonials'
      case 'similar':
        return 'Find similar properties'
      default:
        return 'Enhance with AI'
    }
  }

  const canEnhance = (type: string) => {
    return ['description', 'neighborhood', 'testimonials', 'similar'].includes(type)
  }

  if (!selectedElementId || !selectedElement) {
    return <div className="w-64 p-4 border-l h-full overflow-y-auto">Select an element to edit</div>
  }

  const renderSection = (title: string, content: React.ReactNode) => (
    <Collapsible
      open={openSections.includes(title)}
      onOpenChange={() => toggleSection(title)}
      className="border-b border-gray-200 py-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
        <span className="text-sm font-medium">{title}</span>
        {canEnhance(title) && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEnhanceSection?.(selectedElement.id)}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {getEnhancePrompt(title)}
          </Button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">{content}</CollapsibleContent>
    </Collapsible>
  )

  return (
    <div className="w-64 p-4 border-l overflow-y-auto h-full">
      <h2 className="font-bold mb-4">Edit Element</h2>
      {renderSection(
        "Layout",
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="display">Display</Label>
              <Select value={style.display || ""} onValueChange={(value) => handleStyleChange("display", value)}>
                <SelectTrigger id="display">
                  <SelectValue placeholder="Select display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Select value={style.position || ""} onValueChange={(value) => handleStyleChange("position", value)}>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="relative">Relative</SelectItem>
                  <SelectItem value="absolute">Absolute</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  value={style.width || ""}
                  onChange={(e) => handleStyleChange("width", e.target.value)}
                  placeholder="e.g., 100px or 50%"
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={style.height || ""}
                  onChange={(e) => handleStyleChange("height", e.target.value)}
                  placeholder="e.g., 100px or 50%"
                />
              </div>
            </div>
          </div>
        </>,
      )}
      {renderSection(
        "Typography",
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={style.fontFamily || ""} onValueChange={(value) => handleStyleChange("fontFamily", value)}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Palatino">Palatino</SelectItem>
                  <SelectItem value="Garamond">Garamond</SelectItem>
                  <SelectItem value="Bookman">Bookman</SelectItem>
                  <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                  <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                  <SelectItem value="Arial Black">Arial Black</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="font-size"
                  min={8}
                  max={72}
                  step={1}
                  value={[Number.parseInt(style.fontSize) || 16]}
                  onValueChange={(value) => handleStyleChange("fontSize", `${value[0]}px`)}
                />
                <span>{style.fontSize || "16px"}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                      <div
                        className="w-4 h-4 rounded-full mr-2 border"
                        style={{ backgroundColor: style.color || "#000000" }}
                      />
                      {style.color || "Pick a color"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <input
                      type="color"
                      value={style.color || "#000000"}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      className="w-full h-36"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </>,
      )}
      {renderSection(
        "Background",
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="background-color">Background Color</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                      <div
                        className="w-4 h-4 rounded-full mr-2 border"
                        style={{ backgroundColor: style.backgroundColor || "#ffffff" }}
                      />
                      {style.backgroundColor || "Pick a color"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <input
                      type="color"
                      value={style.backgroundColor || "#ffffff"}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="w-full h-36"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label htmlFor="background-image">Background Image URL</Label>
              <Input
                id="background-image"
                value={style.backgroundImage ? style.backgroundImage.replace(/url$$['"]?|['"]?$$/g, "") : ""}
                onChange={(e) => handleStyleChange("backgroundImage", `url('${e.target.value}')`)}
                placeholder="e.g., https://example.com/image.jpg"
              />
            </div>
          </div>
        </>,
      )}
      {renderSection(
        "Border",
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="border-width">Border Width</Label>
              <Input
                id="border-width"
                value={style.borderWidth || ""}
                onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                placeholder="e.g., 1px"
              />
            </div>
            <div>
              <Label htmlFor="border-style">Border Style</Label>
              <Select
                value={style.borderStyle || ""}
                onValueChange={(value) => handleStyleChange("borderStyle", value)}
              >
                <SelectTrigger id="border-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="groove">Groove</SelectItem>
                  <SelectItem value="ridge">Ridge</SelectItem>
                  <SelectItem value="inset">Inset</SelectItem>
                  <SelectItem value="outset">Outset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="border-color">Border Color</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                      <div
                        className="w-4 h-4 rounded-full mr-2 border"
                        style={{ backgroundColor: style.borderColor || "#000000" }}
                      />
                      {style.borderColor || "Pick a color"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <input
                      type="color"
                      value={style.borderColor || "#000000"}
                      onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                      className="w-full h-36"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label htmlFor="border-radius">Border Radius</Label>
              <Input
                id="border-radius"
                value={style.borderRadius || ""}
                onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                placeholder="e.g., 5px or 50%"
              />
            </div>
          </div>
        </>,
      )}
      {renderSection(
        "Advanced",
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="opacity">Opacity</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="opacity"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[Number.parseFloat(style.opacity) || 1]}
                  onValueChange={(value) => handleStyleChange("opacity", value[0])}
                />
                <span>{(Number.parseFloat(style.opacity) || 1).toFixed(2)}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="z-index">Z-Index</Label>
              <Input
                id="z-index"
                type="number"
                value={style.zIndex || ""}
                onChange={(e) => handleStyleChange("zIndex", e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <Label htmlFor="box-shadow">Box Shadow</Label>
              <Input
                id="box-shadow"
                value={style.boxShadow || ""}
                onChange={(e) => handleStyleChange("boxShadow", e.target.value)}
                placeholder="e.g., 2px 2px 4px rgba(0,0,0,0.1)"
              />
            </div>
          </div>
        </>,
      )}
    </div>
  )
}

