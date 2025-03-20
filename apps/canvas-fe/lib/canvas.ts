
export interface Point {
        x: number;
        y: number;
      }
      
      export interface DrawingElement {
        type: 'path' | 'rectangle' | 'circle' | 'line';
        points: Point[];
        color: string;
        size: number;
        themeColor?: 'light' | 'dark'; // Track which theme the element was created in
      }
      
      export interface CanvasState {
        elements: DrawingElement[];
        currentElement: DrawingElement | null;
      }
      
      // Function to get correct pointer position relative to canvas
      export const getPointerPosition = (
        event: MouseEvent | TouchEvent, 
        canvas: HTMLCanvasElement
      ): Point => {
        const rect = canvas.getBoundingClientRect();
        
        if ('touches' in event) {
          // Touch event
          return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
          };
        } else {
          // Mouse event
          return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };
        }
      };
      
      // Function to draw a path
      export const drawPath = (
        ctx: CanvasRenderingContext2D,
        points: Point[],
        color: string,
        size: number
      ) => {
        if (points.length < 2) return;
      
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
      
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      
        ctx.stroke();
      };
      
      // Function to draw a line
      export const drawLine = (
        ctx: CanvasRenderingContext2D,
        points: Point[],
        color: string,
        size: number
      ) => {
        if (points.length < 2) return;
      
        const [start, end] = points;
      
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      };
      
      // Function to draw a rectangle
      export const drawRectangle = (
        ctx: CanvasRenderingContext2D,
        points: Point[],
        color: string,
        size: number
      ) => {
        if (points.length < 2) return;
      
        const [start, end] = points;
        const width = end.x - start.x;
        const height = end.y - start.y;
      
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        
        ctx.beginPath();
        ctx.rect(start.x, start.y, width, height);
        ctx.stroke();
      };
      
      // Function to draw a circle
      export const drawCircle = (
        ctx: CanvasRenderingContext2D,
        points: Point[],
        color: string,
        size: number
      ) => {
        if (points.length < 2) return;
      
        const [start, end] = points;
        const radiusX = Math.abs(end.x - start.x);
        const radiusY = Math.abs(end.y - start.y);
        const radius = Math.max(radiusX, radiusY);
      
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      };
      
      // Function to redraw all elements on canvas
      export const redrawCanvas = (
        ctx: CanvasRenderingContext2D,
        elements: DrawingElement[]
      ) => {
        // Draw each element
        elements.forEach(element => {
          switch (element.type) {
            case 'path':
              drawPath(ctx, element.points, element.color, element.size);
              break;
            case 'rectangle':
              drawRectangle(ctx, element.points, element.color, element.size);
              break;
            case 'circle':
              drawCircle(ctx, element.points, element.color, element.size);
              break;
            case 'line':
              drawLine(ctx, element.points, element.color, element.size);
              break;
          }
        });
      };
      
      // Save canvas state to localStorage
      export const saveCanvasState = (state: CanvasState) => {
        try {
          localStorage.setItem('canvasState', JSON.stringify(state));
        } catch (error) {
          console.error('Error saving canvas state:', error);
        }
      };
      
      // Load canvas state from localStorage
      export const loadCanvasState = (): CanvasState | null => {
        try {
          const savedState = localStorage.getItem('canvasState');
          if (savedState) {
            return JSON.parse(savedState);
          }
        } catch (error) {
          console.error('Error loading canvas state:', error);
        }
        
        return null;
      };
      
      // Get theme-appropriate color
      export const getThemeColor = (color: string, currentTheme: 'dark' | 'light', elementTheme?: 'dark' | 'light'): string => {
        // Default black and white colors that should change with theme
        const lightModeDefault = '#000000';
        const darkModeDefault = '#FFFFFF';
        const lightModeBackground = '#FFFFFF';
        const darkModeBackground = '#1a1a1a';
        
        // If color matches one of our default colors and themes don't match, swap it
        if (elementTheme && elementTheme !== currentTheme) {
          if (color === lightModeDefault) return darkModeDefault;
          if (color === darkModeDefault) return lightModeDefault;
          
          // For background colors (used in eraser)
          if (color === lightModeBackground || color === '#ffffff') return darkModeBackground;
          if (color === darkModeBackground) return lightModeBackground;
        }
        
        return color;
      };
      