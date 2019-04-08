# pico-build

## Usage

```
pico-build --input ./src --output ./my-cart.p8
```

`--input` is a folder containing lua files. It will concatenate these files in order alphabetically. I recommend naming them '0.foo.lua', '1.bar.lua', '2.baz.lua', etc.

`--output` is a path to the output cart. If the file does not exist, it will create one. If it does exist, it will replace the code in the cart and leave the rest of it untouched.
