import { IProductModuleService } from "@medusajs/framework/types"
import { ExecArgs } from "@medusajs/framework/types"

export default async function seedProductTypes({ container }: ExecArgs) {
  const productModuleService: IProductModuleService =
    container.resolve("product")

  const typesToCreate = [
    "Piston",
    "Crankshaft",
    "Camshaft",
    "Cylinder Head",
    "Engine Mount",
    "Timing Belt/Chain",
    "Fuel Pump",
    "Fuel Injector",
    "Fuel Tank",
    "Carburator",
    "Fuel Filter",
    "Clutch Kit",
    "Flywheel",
    "Gearbox",
    "Torque Converter",
    "CV Axle",
    "Driveshaft",
    "Muffler",
    "Catalytic Converter",
    "Exhaust Manifold",
    "Oxygen Sensor",
    "Brake Pad",
    "Brake Rotor (Disc)",
    "Brake Drum",
    "Brake Shoe",
    "Brake Caliper",
    "Master Cylinder",
    "Brake Hose",
    "ABS Sensor",
    "Shock Absorber",
    "Strut",
    "Coil Spring",
    "Leaf Spring",
    "Control Arm",
    "Ball Joint",
    "Rack and Pinion",
    "Tie Rod End",
    "Power Steering Pump",
    "Steering Column",
    "Battery",
    "Alternator",
    "Starter Motor",
    "Voltage Regulator",
    "Spark Plug",
    "Ignition Coil",
    "Glow Plug (Diesel)",
    "Distributor Cap",
    "Headlight Assembly",
    "Tail Light",
    "Fog Light",
    "Turn Signal",
    "Interior Bulb",
    "MAF Sensor",
    "MAP Sensor",
    "Knock Sensor",
    "Coolant Temp Sensor",
    "Radiator",
    "Water Pump",
    "Thermostat",
    "Cooling Fan",
    "Radiator Hose",
    "AC Compressor",
    "Condenser",
    "Evaporator",
    "Blower Motor",
    "Heater Core",
    "Hood (Bonnet)",
    "Fender",
    "Bumper",
    "Side Mirror",
    "Door Handle",
    "Grille",
    "Windshield",
    "Side Window",
    "Window Regulator",
    "Wiper Blade",
    "Wiper Motor",
    "Seat Cover",
    "Floor Mat",
    "Dashboard Panel",
    "Steering Wheel",
    "Seat Belt",
    "Oil Filter",
    "Air Filter",
    "Cabin Air Filter",
    "Transmission Filter",
    "Engine Oil",
    "Brake Fluid",
    "Coolant",
    "Transmission Fluid",
    "Power Steering Fluid",
  ]

  console.log(
    `Starting seed: Creating ${typesToCreate.length} product types...`,
  )

  const data = typesToCreate.map((type) => ({ value: type }))

  try {
    const createdTypes = await productModuleService.createProductTypes(data)
    console.log(`Successfully created ${createdTypes.length} types.`)
  } catch (error) {
    console.error("Error seeding product types: ", error)
  }
}
