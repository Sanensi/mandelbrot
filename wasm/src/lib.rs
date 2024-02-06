use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Vec2 {
    x: f64,
    y: f64,
}

#[wasm_bindgen]
pub fn create_vec2(x: f64, y: f64) -> Vec2 {
    return Vec2 { x, y };
}

#[wasm_bindgen]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[wasm_bindgen]
pub fn get_mandelbrot_color(c: Vec2, max_iteration: u32) -> Color {
    let mut p = c.clone();

    for _ in 0..=max_iteration {
        p = Vec2 {
            x: (p.x * p.x - p.y * p.y) + c.x,
            y: (2.0 * p.x * p.y) + c.y,
        };

        if f64::sqrt(p.x * p.x + p.y * p.y) > 2.0 {
            return Color {
                r: 255,
                g: 255,
                b: 255,
            };
        }
    }

    return Color { r: 0, g: 0, b: 0 };
}
